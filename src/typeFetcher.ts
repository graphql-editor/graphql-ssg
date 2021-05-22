import fetch from 'node-fetch';
import path from 'path';
import { ConfigFile, updateJSConfig } from '@/config';
import { message } from '@/console';
import { fileWriteRecuirsiveSync } from '@/fsAddons';

const URL_REGEX = new RegExp(/import.*https:\/\/cdn.skypack.dev\/(.*)['|"]/gm);
const TYPINGS_PATH = 'typings';
export const parseDocumentToFindPackages = (content: string) => {
  return [...content.matchAll(URL_REGEX)].map((m) => m[1]);
};

export const constructTypingsUrl = ({
  packageName,
  baseUrl,
  typingsPath,
}: {
  packageName: string;
  baseUrl: string;
  typingsPath: string;
}) => `${baseUrl}/${packageName}/${typingsPath}`;

export const fetchTypingsForUrl = async (url: string) => {
  const module = await fetch(url).then((r) => {
    if (r.status === 404) {
      message(
        `Can't find typings on ${url} Package will remain untyped`,
        'redBright',
      );
      return;
    }
    message(`Installing typings from ${url}`, 'yellowBright');
    return r.text();
  });
  return module;
};

export const mergePackages = (filesContent: string[]) => {
  return filesContent
    .map(parseDocumentToFindPackages)
    .reduce<string[]>((a, b) => {
      b.forEach((p) => {
        if (!a.includes(p)) {
          a.push(p);
        }
      });
      return a;
    }, []);
};

export const fetchTypings = async (packages: string[]) => {
  if (packages.length === 0) {
    return [];
  }
  message(
    'Starting streaming types for packages: ' + packages.join(', '),
    'blueBright',
  );
  const packagesWithTypings = await Promise.all(
    packages.map(async (p) => ({
      packageName: p,
      typings: await fetchTypingsForUrl(
        constructTypingsUrl({
          baseUrl: 'https://cdn.skypack.dev',
          packageName: p,
          typingsPath: 'types/index.d.ts',
        }),
      ),
    })),
  );
  message('Successfully fetched the types', 'greenBright');
  return packagesWithTypings.filter((p) => p.typings) as Array<{
    packageName: string;
    typings: string;
  }>;
};

export const downloadTypings = async (
  configFile: ConfigFile,
  filesContent: string[],
) => {
  const ts = await fetchTypings(mergePackages(filesContent));
  const paths: Record<string, string[]> = {};

  ts.forEach((t) => {
    const typingsPath = path.join(
      configFile.in,
      TYPINGS_PATH,
      t.packageName,
      'index.d.ts',
    );
    fileWriteRecuirsiveSync(typingsPath, t.typings);
    paths[`https://cdn.skypack.dev/${t.packageName}`] = [typingsPath];
  });

  updateJSConfig((jsConfig) => {
    return {
      ...jsConfig,
      compilerOptions: {
        ...jsConfig.compilerOptions,
        baseUrl: './',
        paths,
      },
    };
  });
  //TODO: construct paths for jsconfig and tsconfig
};
