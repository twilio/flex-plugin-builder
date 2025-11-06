#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to link all packages in the packages folder using npm link
 * and then link dependencies between them
 */

const PACKAGES_DIR = path.join(__dirname, 'packages');
const PLUGIN_FLEX_DIR = path.join(PACKAGES_DIR, 'plugin-flex');

// Color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  try {
    log(`${colors.cyan}Executing: ${command}${colors.reset}`, colors.cyan);
    const result = execSync(command, { 
      cwd, 
      stdio: 'inherit',
      encoding: 'utf8' 
    });
    return result;
  } catch (error) {
    log(`${colors.red}Error executing: ${command}${colors.reset}`, colors.red);
    log(`${colors.red}${error.message}${colors.reset}`, colors.red);
    throw error;
  }
}

function getPackageInfo(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
      name: packageJson.name,
      dependencies: {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      }
    };
  } catch (error) {
    log(`${colors.red}Error reading package.json for ${packagePath}: ${error.message}${colors.reset}`, colors.red);
    return null;
  }
}

function getAllPackages() {
  const packages = [];
  const packageDirs = fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const dir of packageDirs) {
    const packagePath = path.join(PACKAGES_DIR, dir);
    const packageInfo = getPackageInfo(packagePath);
    
    if (packageInfo) {
      packages.push({
        ...packageInfo,
        path: packagePath,
        directory: dir
      });
    }
  }
  
  return packages;
}

function createGlobalLinks(packages) {
  log(`${colors.bright}${colors.yellow}Step 1: Creating global npm links for all packages...${colors.reset}`, colors.yellow);
  
  for (const pkg of packages) {
    log(`${colors.green}Creating global link for ${pkg.name}...${colors.reset}`, colors.green);
    try {
      execCommand('npm link', pkg.path);
      log(`${colors.green}✓ Successfully linked ${pkg.name}${colors.reset}`, colors.green);
    } catch (error) {
      log(`${colors.red}✗ Failed to link ${pkg.name}${colors.reset}`, colors.red);
      // Continue with other packages
    }
  }
}

function linkDependencies(packages) {
  log(`${colors.bright}${colors.yellow}Step 2: Linking package dependencies...${colors.reset}`, colors.yellow);
  
  // Create a map of package names for quick lookup
  const packageNameMap = new Map();
  packages.forEach(pkg => packageNameMap.set(pkg.name, pkg));
  
  for (const pkg of packages) {
    log(`${colors.blue}Processing dependencies for ${pkg.name}...${colors.reset}`, colors.blue);
    
    const dependencies = pkg.dependencies || {};
    const localDependencies = [];
    
    // Find dependencies that are also local packages
    for (const [depName, depVersion] of Object.entries(dependencies)) {
      if (packageNameMap.has(depName)) {
        localDependencies.push(depName);
      }
    }
    
    if (localDependencies.length > 0) {
      log(`${colors.magenta}  Found local dependencies: ${localDependencies.join(', ')}${colors.reset}`, colors.magenta);
      
      for (const depName of localDependencies) {
        try {
          log(`${colors.cyan}  Linking ${depName} to ${pkg.name}...${colors.reset}`, colors.cyan);
          execCommand(`npm link "${depName}"`, pkg.path);
          log(`${colors.green}  ✓ Successfully linked ${depName} to ${pkg.name}${colors.reset}`, colors.green);
        } catch (error) {
          log(`${colors.red}  ✗ Failed to link ${depName} to ${pkg.name}${colors.reset}`, colors.red);
          // Continue with other dependencies
        }
      }
    } else {
      log(`${colors.yellow}  No local dependencies found${colors.reset}`, colors.yellow);
    }
  }
}

function runPluginFlexLink() {
  log(`${colors.bright}${colors.yellow}Step 3: Running npm run link in plugin-flex package...${colors.reset}`, colors.yellow);
  
  if (!fs.existsSync(PLUGIN_FLEX_DIR)) {
    log(`${colors.red}Error: plugin-flex directory not found at ${PLUGIN_FLEX_DIR}${colors.reset}`, colors.red);
    return;
  }
  
  try {
    log(`${colors.green}Running npm run link in plugin-flex...${colors.reset}`, colors.green);
    execCommand('npm run link', PLUGIN_FLEX_DIR);
    log(`${colors.green}✓ Successfully ran npm run link in plugin-flex${colors.reset}`, colors.green);
  } catch (error) {
    log(`${colors.red}✗ Failed to run npm run link in plugin-flex${colors.reset}`, colors.red);
    throw error;
  }
}

function main() {
  try {
    log(`${colors.bright}${colors.blue}Starting package linking process...${colors.reset}`, colors.blue);
    log(`${colors.bright}${colors.blue}Working directory: ${__dirname}${colors.reset}`, colors.blue);
    log(`${colors.bright}${colors.blue}Packages directory: ${PACKAGES_DIR}${colors.reset}`, colors.blue);
    
    // Get all packages
    const packages = getAllPackages();
    log(`${colors.bright}${colors.green}Found ${packages.length} packages:${colors.reset}`, colors.green);
    packages.forEach(pkg => {
      log(`  - ${pkg.name} (${pkg.directory})`, colors.green);
    });
    
    // Step 1: Create global links
    createGlobalLinks(packages);
    
    // Step 2: Link dependencies
    linkDependencies(packages);
    
    // Step 3: Run npm run link in plugin-flex
    runPluginFlexLink();
    
    log(`${colors.bright}${colors.green}🎉 Package linking completed successfully!${colors.reset}`, colors.green);
    
  } catch (error) {
    log(`${colors.bright}${colors.red}❌ Package linking failed: ${error.message}${colors.reset}`, colors.red);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getAllPackages,
  createGlobalLinks,
  linkDependencies,
  runPluginFlexLink
};