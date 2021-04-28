/**
 * Test runner for Flex Plugin Builder
 * This is invoked via `npm run test`. You can pass additional parameters using `npm run test -- param1 param2`
 * To run a single test, use `npm run test:one packages/path/to/file/or/directory
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// These packages are ignored and no jest runs for them
const ignorePackages = ['flex-plugin-e2e-tests'];

// fs helper commands
const exists = (src) => src && fs.existsSync(src);
const isDirectory = (src) => exists(src) && fs.lstatSync(src).isDirectory();
const isFile = (src) => exists(src) && fs.lstatSync(src).isFile();
const isEmpty = (src) => exists(src) && isDirectory(src) && fs.readdirSync(src).length !== 0;

// Promisified spawn command
const spawn = async (cmd, args) => {
  return new Promise((resolve) => {
    const child = cp.spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
      encoding: 'utf-8',
    });
    child.on('exit', (code) => {
      if (code !== 0) {
        process.exit(code);
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
const runJest = async (pkg, ...args) => {
  if (exposeGC) {
    await spawn('node', [
      '--expose-gc',
      '--trace-warnings',
      jestCli,
      path.join(pkgDir, pkg),
      '--config',
      path.join(pkgDir, pkg, 'jest.config.js'),
      '-i',
      '--runInBand',
      '--logHeapUsage',
    ]);
    return;
  }

  await spawn(jestCli, [
    path.join(pkgDir, pkg),
    '--config',
    path.join(pkgDir, pkg, 'jest.config.js'),
    '--color',
    '--coverage',
    ...args,
  ]);
  await spawn('mv', [path.join(coverageDir, 'coverage-final.json'), path.join(coverageDir, `${pkg}.json`)]);
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
    const pkg = argv[0].replace('./packages', '').replace('packages', '').split('/')[1];
    argv = argv.splice(1);
    await runJest(pkg, ...argv);
    return;
  }

  await spawn('ls', ['-al', rootDir]);
  await spawn('ls', ['-al', path.join(rootDir, 'node_modules')]);
  await spawn('ls', ['-al', path.join(rootDir, 'node_modules', '.bin')]);

  // Run jest for all packages
  for (let p = 0; p < packages.length; p++) {
    await runJest(packages[p], ...argv);
  }

  // Combine report
  if (!isEmpty(coverageDir)) {
    await runNyc();
  }
})();
