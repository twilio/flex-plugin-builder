import { logger } from 'flex-dev-utils';
import { progress } from 'flex-dev-utils/dist/ora';
import { checkFilesExist, updatePackageVersion, readPackageJson } from 'flex-dev-utils/dist/fs';
import { getCredential } from 'flex-dev-utils/dist/credentials';
import semver, { ReleaseType } from 'semver';

import run from '../utils/run';
import { BuildData } from '../clients/builds';
import { Build, Version } from '../clients/serverless-types';
import availabilityWarning from '../prints/availabilityWarning';
import paths from '../utils/paths';
import { AssetClient, BuildClient, DeploymentClient } from '../clients';
import getRuntime from '../utils/runtime';

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
  disallowVersioning: boolean;
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
 * The main deploy script. This script performs the following in order:
 * 1. Verifies bundle file exists, if not warns about running `npm run build` first
 * 2. Fetches the default Service and Environment from Serverless API
 * 3. Fetches existing Build
 * 4. Verifies the new bundle path does not collide with files in existing Build
 * 5. Creates a new Asset (and an AssetVersion), and uploads the file to S3 for both the bundle and source map
 * 6. Appends the new two files to existing Build's files and creates a new Build
 * 7. Creates a new deployment and sets the Environment build to the new Build.
 *
 * @param nextVersion   the next version of the bundle
 * @param options       options for this deploy
 */
export const _doDeploy = async (nextVersion: string, options: Options) => {
  logger.debug('Deploying Flex plugin');

  if (!checkFilesExist(paths.localBundlePath)) {
    logger.error('Could not find build file. Did you run `npm run build` first?');
    return process.exit(1);
  }

  logger.info('Uploading your Flex plugin to Twilio Assets\n');

  const pluginBaseUrl = paths.assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', nextVersion);
  const bundleUri = `${pluginBaseUrl}/bundle.js`;
  const sourceMapUri = `${pluginBaseUrl}/bundle.js.map`;

  const credential = await getCredential();
  const runtime = await getRuntime(credential);
  const pluginUrl = `https://${runtime.environment.domain_name}${bundleUri}`;

  const buildClient = new BuildClient(credential, runtime.service.sid);
  const assetClient = new AssetClient(credential, runtime.service.sid);
  const deploymentClient = new DeploymentClient(credential, runtime.service.sid, runtime.environment.sid);

  // Check duplicate routes
  const routeCollision = await progress<Build>('Validating the new plugin bundle', async () => {
    const collision = runtime.build ? !_verifyPath(pluginBaseUrl, runtime.build) : false;

    if (collision) {
      if (options.overwrite) {
        if (!options.disallowVersioning) {
          logger.newline();
          logger.warning('Plugin already exists and the flag --overwrite is going to overwrite this plugin.');
        }
      } else {
        throw new Error(`You already have a plugin with the same version: ${pluginUrl}`);
      }
    }

    return collision;
  });

  const buildAssets = runtime.build ? runtime.build.asset_versions : [];
  const buildFunctions = runtime.build ? runtime.build.function_versions : [];
  const buildDependencies = runtime.build ? runtime.build.dependencies : [];

  // Upload plugin bundle and source map to S3
  const buildData = await progress<BuildData>('Uploading your plugin bundle', async () => {
    // Upload bundle and sourcemap
    const bundleVersion = await assetClient
      .upload(paths.packageName, bundleUri, paths.localBundlePath, !options.isPublic);
    const sourceMapVersion = await assetClient
      .upload(paths.packageName, sourceMapUri, paths.localBundlePath, !options.isPublic);

    const existingAssets = routeCollision && options.overwrite
      ?  buildAssets.filter((v) => v.path !== bundleUri && v.path !== sourceMapUri)
      :  buildAssets;

    // Create build
    const data = {
      FunctionVersions: buildFunctions.map((v) => v.sid),
      AssetVersions: existingAssets.map((v) => v.sid),
      Dependencies: buildDependencies,
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

const deploy = async (...argv: string[]) => {
  availabilityWarning();

  const disallowVersioning = argv.includes('--disallow-versioning');
  let nextVersion = argv[1] as string;
  const bump = argv[0];
  const opts = {
    isPublic: argv.includes('--public'),
    overwrite: argv.includes('--overwrite') || disallowVersioning,
    disallowVersioning,
  };

  if (!disallowVersioning) {
    if (!allowedBumps.includes(bump)) {
      logger.error('Version bump can only be one of %s', allowedBumps.join(', '));
      return process.exit(1);
    }

    if (bump === 'custom' && !argv[1]) {
      logger.error('Custom version bump requires the version value');
      return process.exit(1);
    }

    if (bump === 'overwrite') {
      opts.overwrite = true;
      nextVersion = readPackageJson().version;
    } else if (bump !== 'custom') {
      nextVersion = semver.inc(paths.version, bump as ReleaseType) as any;
    }
  } else {
    nextVersion = '0.0.0';
  }

  await _doDeploy(nextVersion, opts);
};

run(deploy);

export default deploy;
