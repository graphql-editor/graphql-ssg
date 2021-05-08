import fs from 'fs';
import path from 'path';
import { bundle, globalTypings } from './module';
import { ConfigFile } from './config';
import { DryadFunctionBodyString } from '@/fn';
import { message } from '@/console';

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

export const injectHtmlFile = async ({
  fileToTransform,
  configFile,
}: {
  fileToTransform: string;
  configFile: ConfigFile;
}) => {
  const cssFile = hasTwinFile(fileToTransform, configFile, 'css');
  return {
    name: createTwinFile(fileToTransform, 'html'),
    code: await bundle({
      name: fileToTransform,
      config: configFile,
      css: cssFile,
    }),
  };
};

export const generateTypingsFiles = async (configFile: ConfigFile) => {
  const typings = await globalTypings({
    configFile,
  });
  fs.writeFileSync(path.join(configFile.in, 'ssg.d.ts'), typings);
};

export const injectJs = ({
  configFile,
  file,
  schema,
}: {
  configFile: ConfigFile;
  file: string;
  schema: string;
}) => {
  const pure = DryadFunctionBodyString({
    schema,
    configFile,
  });
  return [pure, fs.readFileSync(path.join(configFile.in, file))].join('\n');
};

export const transformFiles = async ({
  configFile,
  files,
  schema,
}: {
  configFile: ConfigFile;
  files: string[];
  schema: string;
}) => {
  const htmlFiles = await Promise.all(
    files.map((f) => injectHtmlFile({ fileToTransform: f, configFile })),
  );
  if (!fs.existsSync(configFile.out)) {
    fs.mkdirSync(configFile.out);
  }
  files.forEach((f) => {
    message(`Writing ${path.join(configFile.out, f)}`, 'yellow');
    fs.writeFileSync(
      path.join(configFile.out, f),
      injectJs({ configFile, file: f, schema }),
    );
  });
  htmlFiles.forEach(({ name, code }) => {
    if (code) {
      message(`Writing ${path.join(configFile.out, name)}`, 'yellow');
      fs.writeFileSync(path.join(configFile.out, name), code);
    }
  });
};

export const copyFile = (configFile: ConfigFile, fileName: string) => {
  fs.writeFileSync(
    path.join(configFile.out, fileName),
    fs.readFileSync(path.join(configFile.in, fileName)),
  );
};

export const copyCssFiles = (configFile: ConfigFile) => {
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
    await globalTypings({ configFile }),
  );
};
