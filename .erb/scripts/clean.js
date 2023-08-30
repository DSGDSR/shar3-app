import { rimrafSync } from 'rimraf';
import fs from 'fs';
import webpackPaths from '../config/webpack.paths';

const foldersToRemove = [
  webpackPaths.releasePath,
  webpackPaths.distPath,
  webpackPaths.distRendererPath,
];

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) rimrafSync(folder);
});