const path = require('path');

const rootPath = path.join(__dirname, '../..');

const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'src');
const electronPath = path.join(rootPath, 'electron');
const srcMainPath = path.join(electronPath, 'main');

const releasePath = path.join(rootPath, 'release');
const appPackagePath = path.join(rootPath, 'package.json');
const appNodeModulesPath = path.join(rootPath, 'node_modules');

const distPath = path.join(rootPath, 'dist-electron');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(rootPath, 'dist');

export default {
  rootPath,
  dllPath,
  srcPath,
  srcMainPath,
  releasePath,
  appPackagePath,
  appNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
};