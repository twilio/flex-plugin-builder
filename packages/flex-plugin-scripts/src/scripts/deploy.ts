import {
  logger,
  semver,
  progress,
  FlexPluginError,
  UserActionError,
  Credential,
  getCredential,
  env,
  ReleaseType,
  versionSatisfiesRange,
  confirm,
  singleLineString,
} from '@twilio/flex-dev-utils';
import { checkFilesExist, updateAppVersion, getPackageVersion, getPaths } from '@twilio/flex-dev-utils/dist/fs';

import { setEnvironment } from '..';
import { deploySuccessful, localReactIncompatibleWithRemote } from '../prints';
import run from '../utils/run';
import {
  AssetClient,
  BuildClient,
  DeploymentClient,
  ConfigurationClient,
  UIDependencies,
  AccountsClient,
  ServerlessClient,
  ServerlessBuild,
  ServerlessRuntime,
  ServerlessFileVersion,
} from '../clients';
import getRuntime from '../utils/runtime';

const allowedBumps = ['major', 'minor', 'patch', 'version'];

export interface Options {
  isPublic: boolean;
  overwrite: boolean;
  disallowVersioning: boolean;
}

export interface DeployResult {
  serviceSid: string;
  accountSid: string;
  environmentSid: string;
  domainName: string;
  isPublic: boolean;
  nextVersion: string;
  pluginUrl: string;
}

/**
 * Verifies the new plugin path does not have collision with existing paths of the deployed Runtime service.
 *
 * @param baseUrl   the baseURL of the file
 * @param build     the existing build
 */
export const _verifyPath = (baseUrl: string, build: ServerlessBuild): boolean => {
  const bundlePath = `${baseUrl}/bundle.js`;
  const sourceMapPath = `${baseUrl}/bundle.js.map`;

  const existingAssets = build.asset_versions;
  const existingFunctions = build.function_versions;

  const checkPathIsUnused = (v: ServerlessFileVersion) => v.path !== bundlePath && v.path !== sourceMapPath;

  return existingAssets.every(checkPathIsUnused) && existingFunctions.every(checkPathIsUnused);
};

/**
 * Returns the default version of flex-ui dependency if uiDependency is empty
 * @param uiVersion the Flex UI version
 * @param uiDependencies   the provided ui dependency
 */
export const _getDefaultUIDependencies = (uiVersion: string, uiDependencies: UIDependencies): UIDependencies => {
  if (!uiDependencies.react || !uiDependencies['react-dom']) {
    if (versionSatisfiesRange(uiVersion, '>=2.0.0')) {
      return {
        react: '17.0.2',
        'react-dom': '17.0.2',
      };
    }

    return {
      react: '16.5.2',
      'react-dom': '16.5.2',
    };
  }

  return uiDependencies;
};
/**
 * Validates Flex UI version requirement
 */
export const _verifyFlexUIConfiguration = async (): Promise<void> => {
  const credentials = await getCredential();
  const configurationClient = new ConfigurationClient(credentials.username, credentials.password);

  // Validate Flex UI version
  const uiVersion = await configurationClient.getFlexUIVersion();
  const flexUIDependencies = await configurationClient.getUIDependencies();
  const uiDependencies = _getDefaultUIDependencies(uiVersion, flexUIDependencies);

  const reactVersion = getPackageVersion('react');
  const reactDomVersion = getPackageVersion('react-dom');
  const reactSupported = semver.satisfies(reactVersion, `${uiDependencies.react}`);
  const reactDOMSupported = semver.satisfies(reactDomVersion, `${uiDependencies['react-dom']}`);
  const defaultReactSupported = semver.satisfies('16.5.2', reactVersion) && semver.satisfies('16.5.2', reactDomVersion);
  const UISupports =
    semver.satisfies('1.19.0', uiVersion.replace('.n', '.x')) ||
    versionSatisfiesRange(uiVersion, '>=1.19.0') ||
    defaultReactSupported;

  if (!UISupports) {
    throw new FlexPluginError(
      singleLineString(
        `We detected that your account is using Flex UI version ${uiVersion} which is incompatible`,
        `with unbundled React. Please visit https://flex.twilio.com/admin/versioning and update to`,
        `version 1.19 or above.`,
      ),
    );
  }

  if (!reactSupported || !reactDOMSupported) {
    const isQuiet = env.isQuiet();
    env.setQuiet(false);
    localReactIncompatibleWithRemote(reactVersion, uiDependencies.react || '');
    const answer = await confirm('Do you still want to continue deploying?', 'N');
    if (!answer) {
      logger.newline();
      throw new UserActionError('User rejected confirmation to deploy with mismatched React version.');
    }
    logger.newline();
    env.setQuiet(isQuiet);
  }
};

/**
 * Returns the Account object only if credentials provided is AccountSid/AuthToken, otherwise returns a dummy data
 * @param runtime     the {@link Runtime}
 * @param credentials the {@link Credential}
 * @private
 */
export const _getAccount = async (runtime: ServerlessRuntime, credentials: Credential): Promise<{ sid: string }> => {
  const accountClient = new AccountsClient(credentials.username, credentials.password);

  if (credentials.username.startsWith('AC')) {
    return accountClient.get(runtime.service.account_sid);
  }

  return {
    sid: runtime.service.account_sid,
  };
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
export const _doDeploy = async (nextVersion: string, options: Options): Promise<DeployResult> => {
  if (!checkFilesExist(getPaths().app.bundlePath)) {
    throw new FlexPluginError('Could not find build file. Did you run `twilio flex:plugins:build` first?');
  }

  const pluginBaseUrl = getPaths().assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', nextVersion);
  const bundleUri = `${pluginBaseUrl}/bundle.js`;
  const sourceMapUri = `${pluginBaseUrl}/bundle.js.map`;

  const credentials = await getCredential();
  logger.info('Uploading your Flex plugin to Twilio Assets\n');

  const runtime = await getRuntime(credentials);
  if (!runtime.environment) {
    throw new FlexPluginError('No Runtime environment was found');
  }
  const pluginUrl = `https://${runtime.environment.domain_name}${bundleUri}`;

  const configurationClient = new ConfigurationClient(credentials.username, credentials.password);

  const serverlessClient = new ServerlessClient(credentials.username, credentials.password);
  const buildClient = new BuildClient(serverlessClient, runtime.service.sid);
  const assetClient = new AssetClient(serverlessClient, runtime.service.sid);
  const deploymentClient = new DeploymentClient(serverlessClient, runtime.service.sid, runtime.environment.sid);

  if (!env.isCLI()) {
    await _verifyFlexUIConfiguration();
  }

  // Check duplicate routes
  const routeCollision = await progress('Validating the new plugin bundle', async () => {
    const collision = runtime.build ? !_verifyPath(pluginBaseUrl, runtime.build) : false;

    if (collision) {
      if (options.overwrite) {
        if (!options.disallowVersioning) {
          logger.newline();
          logger.warning('Plugin already exists and the flag --overwrite is going to overwrite this plugin.');
        }
      } else if (env.isCI() || !env.isCLI()) {
        throw new FlexPluginError(`You already have a plugin with the same version: ${pluginUrl}`);
      }
    }

    return collision;
  });

  const buildAssets = runtime.build ? runtime.build.asset_versions : [];
  const buildFunctions = runtime.build ? runtime.build.function_versions : [];
  const buildDependencies = runtime.build ? runtime.build.dependencies : [];

  // Upload plugin bundle and source map to S3
  const buildData = await progress('Uploading your plugin bundle', async () => {
    // Upload bundle and sourcemap
    const bundleVersion = await assetClient.upload(
      getPaths().app.name,
      bundleUri,
      getPaths().app.bundlePath,
      !options.isPublic,
    );
    const sourceMapVersion = await assetClient.upload(
      getPaths().app.name,
      sourceMapUri,
      getPaths().app.sourceMapPath,
      !options.isPublic,
    );

    const existingAssets =
      routeCollision && options.overwrite
        ? buildAssets.filter((v) => v.path !== bundleUri && v.path !== sourceMapUri)
        : buildAssets;

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

  // Register service sid with Config service
  await progress('Registering plugin with Flex', async () => {
    await configurationClient.registerSid(runtime.service.sid);
  });

  const deployResult = {
    serviceSid: runtime.service.sid,
    accountSid: runtime.service.account_sid,
    environmentSid: runtime.environment.sid,
    domainName: runtime.environment.domain_name,
    isPublic: options.isPublic,
    nextVersion,
    pluginUrl,
  };

  if (routeCollision && !options.overwrite) {
    return deployResult;
  }

  // Create a build, and poll regularly until build is complete
  await progress('Deploying a new build of your Twilio Runtime', async () => {
    const newBuild = await buildClient.create(buildData);
    const deployment = await deploymentClient.create(newBuild.sid);

    updateAppVersion(nextVersion);

    return deployment;
  });

  deploySuccessful(pluginUrl, options.isPublic, await _getAccount(runtime, credentials));

  return deployResult;
};

const deploy = async (...argv: string[]): Promise<DeployResult> => {
  setEnvironment(...argv);
  logger.debug('Deploying Flex plugin');

  const disallowVersioning = argv.includes('--disallow-versioning');
  let nextVersion = argv[1] as string;
  const bump = argv[0];
  const opts: Options = {
    isPublic: argv.includes('--public'),
    overwrite: argv.includes('--overwrite') || disallowVersioning,
    disallowVersioning,
  };

  if (disallowVersioning) {
    nextVersion = '0.0.0';
  } else {
    if (!allowedBumps.includes(bump)) {
      throw new FlexPluginError(`Version bump can only be one of ${allowedBumps.join(', ')}`);
    }

    if (bump === 'version' && !argv[1]) {
      throw new FlexPluginError('Custom version bump requires the version value.');
    }

    if (bump === 'overwrite') {
      opts.overwrite = true;
      nextVersion = getPaths().app.version;
    } else if (bump !== 'version') {
      nextVersion = semver.inc(getPaths().app.version, bump as ReleaseType) as string;
    }
  }

  return _doDeploy(nextVersion, opts);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(deploy);

// eslint-disable-next-line import/no-unused-modules
export default deploy;
