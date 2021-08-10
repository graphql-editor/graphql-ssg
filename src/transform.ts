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
  fileWriteRecuirsiveSync,
  isDirectory,
  isJSFile,
  isStaticFile,
  isTSFile,
  fileRegex,
} from '@/fsAddons';
import { envsTypings } from '@/fn';
import ts from 'typescript';
import { transform } from 'esbuild';

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
export const readFiles = async (
  p: string,
  matchFunction: (p: string) => boolean,
) => {
  const allFiles: string[] = [];
  for await (const f of getFiles(p)) {
    const t = f as string;
    if (matchFunction(t)) {
      allFiles.push(t);
    }
  }
  return allFiles;
};

export const createTwinFile = (fileToTransform: string, extension?: string) => {
  const regexResult = fileToTransform.match(fileRegex);
  if (!regexResult) {
    throw new Error(
      'Invalid file provided to function. Only accepting files matching mock regex',
    );
  }
  const twinFileName = extension
    ? `${regexResult[1]}.${extension}`
    : regexResult[1];
  return twinFileName;
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
    name: createTwinFile(fileToTransform),
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

export const transformFiles = async ({ config }: { config: ConfigFile }) => {
  console.time('Build');
  const tsFiles = await readFiles(config.in, isTSFile);
  if (tsFiles.length > 0) {
    const tsconfig = JSON.parse(
      fs.readFileSync('./tsconfig.json').toString('utf-8'),
    );
    await Promise.all(
      tsFiles.map(async (tsFile) => {
        const transpiled = await transpileTS(
          fs.readFileSync(path.join(config.in, tsFile)).toString('utf-8'),
          tsFile.endsWith('tsx') ? 'tsx' : 'ts',
          tsconfig,
        );
        const jsFileName = path.join(
          config.in,
          tsFile.replace(/\.tsx?$/, '.js'),
        );
        fileWriteRecuirsiveSync(jsFileName, transpiled.code);
      }),
    );
  }
  const files = await readFiles(config.in, isJSFile);
  message('Sending code to browser', 'yellowBright');
  const htmlFiles = (
    await Promise.all(
      files.map((f) => injectHtmlFile({ fileToTransform: f, config })),
    )
  ).filter((f) => f.code);
  message('Code render successful', 'greenBright');
  const rf = files.map((f) => ({
    name: f,
    path: path.join(config.out, f),
    content: fs.readFileSync(path.join(config.in, f)),
  }));
  await downloadTypings(
    config,
    rf.map((r) => r.content.toString('utf-8')),
  );
  message(`Writing out ${rf.length} files.`, 'yellow');
  rf.forEach((f) => {
    fileWriteRecuirsiveSync(path.join(config.out, f.name), f.content);
  });
  message(`Writing out ${htmlFiles.length} pages.`, 'yellow');
  htmlFiles.forEach(({ name, code }) => {
    if (code?.pages) {
      code.pages.forEach((page) => {
        fileWriteRecuirsiveSync(
          path.join(config.out, name, page.slug + '.html'),
          page.body,
        );
      });
      return;
    }
    if (code?.content) {
      fileWriteRecuirsiveSync(
        `${path.join(config.out, name)}.html`,
        code.content,
      );
    }
  });
  console.timeEnd('Build');
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
    .filter(isStaticFile)
    .forEach((f) => {
      copyFile(config, f);
    });
};

export const cleanBuild = (config: ConfigFile) => {
  if (fs.existsSync(config.out)) {
    fs.rmSync(config.out, { recursive: true });
  }
};

export const transpileTS = (
  code: string,
  loader: 'ts' | 'tsx',
  options: ts.TranspileOptions,
) => {
  return transform(code, {
    tsconfigRaw: JSON.stringify(options),
    loader,
    format: 'esm',
  });
};
