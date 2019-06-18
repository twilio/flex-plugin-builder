import semver, { ReleaseType } from 'semver';

import { getCredentials } from '../clients/auth';
import { BuildData } from '../clients/builds';
import { Build, Runtime, Version } from '../clients/serverless-types';
import availabilityWarning from '../prints/availabilityWarning';
import { checkFileExists, readPackage, updatePackageVersion } from '../utils/fs';
import logger from '../utils/logger';
import paths from '../utils/paths';
import { AssetClient, ServiceClient, EnvironmentClient, BuildClient, DeploymentClient } from '../clients';
import { progress } from '../utils/general';

const allowedBumps = [
  'major',
  'minor',
  'patch',
  'custom',
  'overwrite',
];

interface Options {
  isPublic: boolean;
  overwrite: boolean;
}

/**
 * Verifies the new plugin path does not have collision with existing paths of the deployed Runtime service.
 *
 * @param baseUrl   the baseURL of the file
 * @param build     the existing build
 */
export const _verifyPath = (baseUrl: string, build: Build) => {
  const bundlePath = `${baseUrl}/bundle.js`;
  const sourceMapPath = `${baseUrl}/bundle.js.map`;

  const existingAssets = build.asset_versions;
  const existingFunctions = build.function_versions;

  const checkPathIsUnused = (v: Version) => v.path !== bundlePath && v.path !== sourceMapPath;

  return existingAssets.every(checkPathIsUnused) && existingFunctions.every(checkPathIsUnused);
};

/**
 * The main release script. This script performs the following in order:
 * 1. Verifies bundle file exists, if not warns about running `npm run build` first
 * 2. Fetches the default Service and Environment from Serverless API
 * 3. Fetches existing Build
 * 4. Verifies the new bundle path does not collide with files in existing Build
 * 5. Creates a new Asset (and an AssetVersion), and uploads the file to S3 for both the bundle and source map
 * 6. Appends the new two files to existing Build's files and creates a new Build
 * 7. Creates a new deployment and sets the Environment build to the new Build.
 *
 * @param nextVersion   the next version of the bundle
 * @param options       options for this release
 */
export const _doRelease = async (nextVersion: string, options: Options) => {
  logger.debug('Releasing Flex plugin');

  if (!checkFileExists(paths.localBundlePath)) {
    logger.error('Could not find build file. Did you run `npm run build` first?');
    return process.exit(1);
  }

  logger.info('Uploading your Flex plugin to Twilio Assets\n');

  const pluginBaseUrl = paths.assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', nextVersion);
  const bundleUri = `${pluginBaseUrl}/bundle.js`;
  const sourceMapUri = `${pluginBaseUrl}/bundle.js.map`;

  // Fetch AccountSid/AuthToken first
  const credentials = await getCredentials();

  // Fetch the runtime service instance
  const runtime = await progress<Runtime>('Fetching Twilio Runtime service', async () => {
    const serverlessClient = new ServiceClient(credentials);
    const service = await serverlessClient.getDefault();

    const environmentClient = new EnvironmentClient(credentials, service.sid);
    const environment = await environmentClient.getDefault();

    return {
      service,
      environment,
    };
  });
  const pluginUrl = `https://${runtime.environment.domain_name}${bundleUri}`;

  const buildClient = new BuildClient(credentials, runtime.service.sid);
  const assetClient = new AssetClient(credentials, runtime.service.sid);
  const deploymentClient = new DeploymentClient(credentials, runtime.service.sid, runtime.environment.sid);

  // Create build
  const existingBuild = await progress<Build>('Validating the new plugin bundle', async () => {
    // This is the first time we are doing a build, so we don't have a pre-existing build
    if (!runtime.environment.build_sid) {
      return {
        function_versions: [],
        asset_versions: [],
        dependencies: {},
      };
    }

    const _existingBuild = await buildClient.get(runtime.environment.build_sid);
    if (!_verifyPath(pluginBaseUrl, _existingBuild)) {
      if (options.overwrite) {
        logger.newline();
        logger.warning('Plugin already exists and the flag --overwrite is going to overwrite this plugin.');
      } else {
        throw new Error(`You already have a plugin with the same version: ${pluginUrl}`);
      }
    }

    return _existingBuild;
  });

  // Upload plugin bundle and source map to S3
  const buildData = await progress<BuildData>('Uploading your plugin bundle', async () => {
    // Upload bundle and sourcemap
    const bundleVersion = await assetClient
      .upload(paths.packageName, bundleUri, paths.localBundlePath, !options.isPublic);
    const sourceMapVersion = await assetClient
      .upload(paths.packageName, sourceMapUri, paths.localBundlePath, !options.isPublic);

    const existingAssets =  !_verifyPath(pluginBaseUrl, existingBuild) && options.overwrite
      ?  existingBuild.asset_versions.filter((v) => v.path !== bundleUri && v.path !== sourceMapUri)
      :  existingBuild.asset_versions;

    // Create build
    const data = {
      FunctionVersions: existingBuild.function_versions.map((v) => v.sid),
      AssetVersions: existingAssets.map((v) => v.sid),
      Dependencies: existingBuild.dependencies,
    };
    data.AssetVersions.push(bundleVersion.sid);
    data.AssetVersions.push(sourceMapVersion.sid);

    return data;
  });

  // Create a build, and poll regularly until build is complete
  await progress<Build>('Deploying a new build of your Twilio Runtime', async () => {
    const newBuild = await buildClient.create(buildData);
    const deployment = await deploymentClient.create(newBuild.sid);

    updatePackageVersion(nextVersion);

    return deployment;
  });

  const availability = options.isPublic ? 'publicly' : 'privately';
  logger.newline();
  logger.success(`🚀  Your plugin is now (${availability}) on ${logger.colors.blue(pluginUrl)}`);
  logger.newline();
};

const release = async (...argv: string[]) => {
  availabilityWarning();

  const bump = argv[0];
  const opts = {
    isPublic: argv.includes('--public'),
    overwrite: argv.includes('--overwrite'),
  };

  if (!allowedBumps.includes(bump)) {
    logger.error('Version bump can only be one of %s', allowedBumps.join(', '));
    return process.exit(1);
  }

  let nextVersion = argv[1] as string;
  if (bump === 'custom' && !argv[1]) {
    logger.error('Custom version bump requires the version value');
    return process.exit(1);
  }

  if (bump === 'overwrite') {
    opts.overwrite = true;
    nextVersion = readPackage().version;
  } else if (bump !== 'custom') {
    nextVersion = semver.inc(paths.version, bump as ReleaseType) as any;
  }

  await _doRelease(nextVersion, opts);
};

// Called directly/spawned
if (require.main === module) {
  (async () => await release(...process.argv.splice(2)))().catch(logger.error);
}

export default release;
