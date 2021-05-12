import fs from 'fs';
import path from 'path';
import { bundle } from './module';
import { ConfigFile } from './config';
import { DryadFunctionBodyString, GenerateGlobalTypings } from '@/fn';
import { message } from '@/console';

const fileRegex = /(.*)\.js$/;
const cssRegex = /(.*)\.css$/;

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

export const generateTypingsFiles = async ({
  schema,
  configFile,
}: {
  schema: string;
  configFile: ConfigFile;
}) => {
  const typings = await GenerateGlobalTypings({
    configFile,
    schema,
  });
  const ssgFile = await DryadFunctionBodyString(schema);
  const ssgPath = path.join(configFile.in, 'ssg');
  if (!fs.existsSync(ssgPath)) {
    fs.mkdirSync(ssgPath);
  }
  fs.writeFileSync(path.join(ssgPath, 'index.js'), ssgFile);
  fs.writeFileSync(path.join(ssgPath, 'index.d.ts'), typings.ssg);
  fs.writeFileSync(path.join(configFile.in, 'graphql-ssg.d.ts'), typings.env);
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
    const hasDir = f.split('/');
    if (hasDir.length > 1) {
      const dirs = hasDir.splice(0, hasDir.length - 1);
      const dir = path.join(configFile.out, dirs.join('/'));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    fs.writeFileSync(
      path.join(configFile.out, f),
      fs.readFileSync(path.join(configFile.in, f)),
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
