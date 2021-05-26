import fs from 'fs';
import path from 'path';
import { bundle } from './module';
import { ConfigFile } from './config';
import {
  DryadFunctionBodyString,
  GenerateGlobalTypings,
  md,
  basicFunctions,
} from '@/fn';
import { message } from '@/console';
import { downloadTypings } from '@/typeFetcher';
import {
  fileRegex,
  fileWriteRecuirsiveSync,
  isDirectory,
  typingsRegex,
} from '@/fsAddons';
import { envsTypings } from '@/fn';

const getFiles = (dir: string) => {
  const result = [];

  const files = [dir];
  do {
    const filepath = files.pop()!;
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      fs.readdirSync(filepath).forEach((f) =>
        files.push(path.join(filepath, f)),
      );
    } else if (stat.isFile()) {
      result.push(path.relative(dir, filepath));
    }
  } while (files.length !== 0);

  return result;
};
export const readFiles = async (p: string) => {
  const allFiles: string[] = [];
  for await (const f of getFiles(p)) {
    const t = f as string;
    const regexResult = t.match(fileRegex);
    if (regexResult && regexResult.length > 1) {
      allFiles.push(t);
    }
  }
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
  config: ConfigFile,
  extension: string,
) => {
  let twinFile: string | undefined;
  const twinFileName = createTwinFile(fileToTransform, extension);
  const hasCorrespondingTwinFile = fs.existsSync(
    path.join(config.in, twinFileName),
  );
  if (hasCorrespondingTwinFile) {
    twinFile = twinFileName;
  }
  return twinFile;
};

export const injectHtmlFile = async ({
  fileToTransform,
  config,
}: {
  fileToTransform: string;
  config: ConfigFile;
}) => {
  const cssFile = hasTwinFile(fileToTransform, config, 'css');
  return {
    name: createTwinFile(fileToTransform, 'html'),
    code: await bundle({
      name: fileToTransform,
      config: config,
      css: cssFile,
    }),
  };
};

export const generateBasicTypingsFiles = async (config: ConfigFile) => {
  const ssgPath = path.join(config.in, 'ssg');
  fileWriteRecuirsiveSync(path.join(ssgPath, 'md.js'), md.code);
  fileWriteRecuirsiveSync(path.join(ssgPath, 'md.d.ts'), md.typings);
  fileWriteRecuirsiveSync(path.join(ssgPath, 'basic.js'), basicFunctions.code);
  fileWriteRecuirsiveSync(
    path.join(ssgPath, 'basic.d.ts'),
    basicFunctions.typings,
  );

  fileWriteRecuirsiveSync(
    path.join(config.in, 'graphql-ssg.d.ts'),
    envsTypings(config),
  );
};

export const generateTypingsFiles = async ({
  name,
  schema,
  config,
}: {
  name: string;
  schema: string;
  config: ConfigFile;
}) => {
  const typings = await GenerateGlobalTypings({
    config,
    schema,
  });
  const ssgFile = await DryadFunctionBodyString(schema);
  const ssgPath = path.join(config.in, 'ssg', name);
  fileWriteRecuirsiveSync(path.join(ssgPath, 'index.js'), ssgFile);
  fileWriteRecuirsiveSync(path.join(ssgPath, 'index.d.ts'), typings.ssg);
};

export const transformFiles = async ({
  config,
  files,
}: {
  config: ConfigFile;
  files: string[];
}) => {
  const htmlFiles = await Promise.all(
    files.map((f) => injectHtmlFile({ fileToTransform: f, config })),
  );
  const readFiles = files.map((f) => ({
    name: f,
    path: path.join(config.out, f),
    content: fs.readFileSync(path.join(config.in, f)),
  }));
  await downloadTypings(
    config,
    readFiles.map((r) => r.content.toString('utf-8')),
  );
  readFiles.forEach((f) => {
    message(`Writing ${path.join(config.out, f.name)}`, 'yellow');
    fileWriteRecuirsiveSync(path.join(config.out, f.name), f.content);
  });
  htmlFiles.forEach(({ name, code }) => {
    if (code) {
      message(`Writing ${path.join(config.out, name)}`, 'yellow');
      fileWriteRecuirsiveSync(path.join(config.out, name), code);
    }
  });
};

export const copyFile = (config: ConfigFile, relativeFilePath: string) => {
  fileWriteRecuirsiveSync(
    path.join(config.out, relativeFilePath),
    fs.readFileSync(path.join(config.in, relativeFilePath)),
  );
};

export const copyStaticFiles = (config: ConfigFile) => {
  const files = getFiles(config.in);
  files
    .filter((f) => !isDirectory(path.join(config.in, f)))
    .filter((f) => !(f.match(fileRegex) || f.match(typingsRegex)))
    .forEach((f) => {
      copyFile(config, f);
    });
};

export const cleanBuild = (config: ConfigFile) => {
  if (fs.existsSync(config.out)) {
    fs.rmSync(config.out, { recursive: true });
  }
};
