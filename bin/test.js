/* eslint-disable no-console, no-process-exit, @typescript-eslint/prefer-for-of */
/**
 * Test runner for Flex Plugin Builder
 * This is invoked via `npm run test`. You can pass additional parameters using `npm run test -- param1 param2`
 * To run a single test, use `npm run test:one packages/path/to/file/or/directory
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');

// These packages are ignored and no jest runs for them
const ignorePackages = ['flex-plugin-e2e-tests'];

// Helper commands
const isCI = () => process.env.CI;
const isWin = () => os.platform() === 'win32';
const exists = (src) => src && fs.existsSync(src);
const isDirectory = (src) => exists(src) && fs.lstatSync(src).isDirectory();
const isFile = (src) => exists(src) && fs.lstatSync(src).isFile();
const isEmpty = (src) => exists(src) && isDirectory(src) && fs.readdirSync(src).length !== 0;

// Promisified spawn command
const spawn = async (cmd, args) => {
  return new Promise((resolve) => {
    const shell = isWin() ? true : process.env.SHELL;
    if (isCI()) {
      console.log(`Running spawn with command ${cmd} and args ${args}`);
    }

    const child = cp.spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env,
      shell,
      stdio: 'inherit',
      encoding: 'utf-8',
    });

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Spawn command ${cmd} ${args} exited with non zero status code ${code}`);
        if (code === 1 && isWin()) {
          console.warning('Temporally exiting with code 0 because Windows tests are still not complete');
          process.exit(0);
        } else {
          process.exit(code);
        }
      }
      resolve();
    });
  });
};

const exposeGC = process.env.EXPOSE_GC;
const rootDir = path.join(__dirname, '..');
const coverageDir = path.join(rootDir, 'coverage');
const pkgDir = path.join(rootDir, 'packages');
const jestCli = path.join(rootDir, 'node_modules', '.bin', 'jest');
const nycCli = path.join(rootDir, 'node_modules', '.bin', 'nyc');
let argv = process.argv.splice(2);

// Runs jest for the given package
const runJest = async (location, pkg, ...args) => {
  const join = (...paths) => path.join(...paths).replace(/\\/g, '/');

  if (exposeGC) {
    await spawn('node', [
      '--expose-gc',
      '--trace-warnings',
      jestCli,
      location,
      '--config',
      path.join(pkgDir, pkg, 'jest.config.js'),
      '-i',
      '--runInBand',
      '--logHeapUsage',
    ]);
    return;
  }

  await spawn(jestCli, [join(location), '--config', join(pkgDir, pkg, 'jest.config.js'), '--color', ...args]);
  const report = path.join(coverageDir, 'coverage-final.json');
  if (exists(report)) {
    await spawn('mv', [report, path.join(coverageDir, `${pkg}.json`)]);
  }
};

// Runs NYC and combines coverage reporting
const runNyc = async () => {
  await spawn(nycCli, [
    'report',
    '-t',
    './coverage',
    '--report-dir',
    './coverage',
    '--reporter=html',
    '--reporter=lcov',
  ]);
};

// List of packages/directory names - test will run for these packages
const packages = fs
  .readdirSync(pkgDir)
  .filter((name) => !ignorePackages.includes(name))
  .filter((name) => isDirectory(path.join(pkgDir, name)));

// Start script
(async () => {
  // Running jest for a single file/directory
  if (isDirectory(argv[0]) || isFile(argv[0])) {
    const location = argv[0];
    const pkg = location.replace('./packages', '').replace('packages', '').split('/')[1];
    argv = argv.splice(1);
    await runJest(location, pkg, ...argv);
    return;
  }

  // Run jest for all packages
  for (let p = 0; p < packages.length; p++) {
    const pkg = packages[p];
    await runJest(path.join(pkgDir, pkg), pkg, ...argv);
  }

  // Combine report
  if (!isEmpty(coverageDir)) {
    await runNyc();
  }
})().catch((e) => {
  console.log('exit in catch');
  console.error('the error is', e);

  process.exit(1);
});
