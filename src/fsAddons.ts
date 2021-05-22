import fs from 'fs';
import path from 'path';

export const fileRegex = /(.*)\.js$/;

export const typingsRegex = /(.*)\.d\.ts$/;
export const cssRegex = /(.*)\.css$/;

export const isCss = (p: string) => p.match(cssRegex);
export const isDirectory = (p: string) => fs.statSync(p).isDirectory();
export const isStaticFile = (p: string) =>
  !(p.match(fileRegex) || p.match(typingsRegex));

export const mkFileDirSync = (p: string) => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const fileWriteRecuirsiveSync = (
  p: string,
  data: string | NodeJS.ArrayBufferView,
) => {
  mkFileDirSync(p);
  fs.writeFileSync(p, data);
};
