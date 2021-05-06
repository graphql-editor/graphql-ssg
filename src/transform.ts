import fs from 'fs';
import path from 'path';
import { bundle, globalTypings } from './module';
import { ConfigFile } from './config';
import { Utils } from 'graphql-zeus';
import { DryadFunctionBodyString } from '@/fn';

const fileRegex = /(.*)\.js$/;
const cssRegex = /(.*)\.css$/;

export const readFiles = (path: string) => {
  const allFiles: string[] = [];
  const files = fs.readdirSync(path);
  files.forEach((f) => {
    const regexResult = f.match(fileRegex);
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
  return createTwinFileWithRegex(fileToTransform, extension, fileRegex);
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

export const transformFile = (configFile: ConfigFile, schema: string) => async (
  fileToTransform: string,
) => {
  const cssFile = hasTwinFile(fileToTransform, configFile, 'css');
  const js = fs
    .readFileSync(path.join(configFile.in, fileToTransform))
    .toString('utf8');
  const pure = await DryadFunctionBodyString({
    schema,
    js,
    url: configFile.url,
  });

  return {
    html: {
      name: createTwinFile(fileToTransform, 'html'),
      code: await bundle({
        name: fileToTransform,
        code: pure.code,
        config: configFile,
        css: cssFile,
      }),
    },
    js: {
      name: fileToTransform,
      code: pure.code,
    },
  };
};

export const transformFiles = async (
  configFile: ConfigFile,
  files: string[],
) => {
  const schema = await Utils.getFromUrl(configFile.url, configFile.headers);
  const transformWithConfig = transformFile(configFile, schema);
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
  htmlFiles.forEach(({ html, js }) => {
    fs.writeFileSync(path.join(configFile.out, `${html.name}`), html.code);
    fs.writeFileSync(path.join(configFile.out, `${js.name}`), js.code);
  });
};

export const copyFile = (configFile: ConfigFile, fileName: string) => {
  fs.writeFileSync(
    path.join(configFile.out, fileName),
    fs.readFileSync(path.join(configFile.in, fileName)),
  );
};

export const copyCssFiles = async (configFile: ConfigFile) => {
  const files = fs.readdirSync(configFile.in);
  files.forEach((f) => {
    const regexResult = f.match(cssRegex);
    if (regexResult && regexResult.length > 1) {
      copyFile(configFile, f);
    }
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
