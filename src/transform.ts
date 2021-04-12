import fs from 'fs';
import path from 'path';
import { bundle, globalTypings } from './module';
import { ConfigFile } from './config';

const mockRegex = /(.*)\.zeus\.(js|ts)$/;
const fileRegex = /(.*)\.(js|ts)$/;

export const readFiles = (path: string) => {
  const allFiles: string[] = [];
  const files = fs.readdirSync(path);
  files.forEach((f) => {
    const regexResult = f.match(mockRegex);
    if (regexResult && regexResult.length > 1) {
      allFiles.push(f);
    }
  });
  return allFiles;
};

export const createTwinFileWithRegex = (
  fileToTransform: string,
  extension: string,
  reg: RegExp,
) => {
  const regexResult = fileToTransform.match(reg);
  if (!regexResult) {
    throw new Error(
      'Invalid file provided to function. Only accepting files matching mock regex',
    );
  }
  const twinFileName = `${regexResult[1]}.${extension}`;
  return twinFileName;
};

export const createTwinFile = (fileToTransform: string, extension: string) => {
  return createTwinFileWithRegex(fileToTransform, extension, mockRegex);
};

export const hasTwinFile = (
  fileToTransform: string,
  configFile: ConfigFile,
  extension: string,
) => {
  let twinFile: string | undefined;
  const twinFileName = createTwinFile(fileToTransform, extension);
  const hasCorrespondingTwinFile = fs.existsSync(
    path.join(configFile.in, twinFileName),
  );
  if (hasCorrespondingTwinFile) {
    twinFile = twinFileName;
  }
  return twinFile;
};

export const transformFile = (configFile: ConfigFile) => async (
  fileToTransform: string,
) => {
  const cssFile = hasTwinFile(fileToTransform, configFile, 'css');
  return {
    name: createTwinFile(fileToTransform, 'html'),
    content: await bundle({
      schemaUrl: configFile.url,
      js: fs
        .readFileSync(path.join(configFile.in, fileToTransform))
        .toString('utf8'),
      css: cssFile
        ? fs.readFileSync(path.join(configFile.in, cssFile)).toString('utf8')
        : undefined,
      config: configFile,
    }),
  };
};

export const transformFiles = async (
  configFile: ConfigFile,
  files: string[],
) => {
  const transformWithConfig = transformFile(configFile);
  const htmlFiles = await Promise.all(files.map(transformWithConfig));
  const typings = await globalTypings({ schemaUrl: configFile.url });
  files.forEach((f) => {
    fs.writeFileSync(
      path.join(configFile.in, createTwinFileWithRegex(f, 'd.ts', fileRegex)),
      typings,
    );
  });
  if (!fs.existsSync(configFile.out)) {
    fs.mkdirSync(configFile.out);
  }
  htmlFiles.forEach((f) => {
    fs.writeFileSync(path.join(configFile.out, `${f.name}`), f.content);
  });
};

export const generateGlobalFile = async (
  filename: string,
  configFile: ConfigFile,
) => {
  fs.writeFileSync(
    path.join(configFile.in, `${filename}.d.ts`),
    await globalTypings({ schemaUrl: configFile.url }),
  );
};
