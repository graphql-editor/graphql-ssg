import { ConfigFile } from '@/config';
import { existsJSONOrDefaultSync } from '@/fsAddons';
import fs from 'fs';

const TSConfig = (config: ConfigFile) => ({
  compilerOptions: {
    incremental: true /* Enable incremental compilation */,
    target:
      'esnext' /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    module:
      'ES2020' /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    strict: true /* Enable all strict type-checking options. */,
    esModuleInterop: true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    skipLibCheck: true /* Skip type checking of declaration files. */,
    forceConsistentCasingInFileNames: true /* Disallow inconsistently-cased references to the same file. */,
    allowJs: true,
    noEmit: true,
    baseUrl: '' /* leave or change to ./ for url imports to work */,
  },
});

const JSConfig = () => ({
  compilerOptions: {
    target: 'esnext',
    module: 'commonjs',
    baseUrl: './',
  },
  include: ['./pages/**/*', './pages/graphql-ssg.d.ts'],
});

export const getJsConfig = () =>
  existsJSONOrDefaultSync('./jsconfig.json', JSConfig());

export const getTsConfig = (config: ConfigFile) =>
  existsJSONOrDefaultSync('./tsconfig.json', TSConfig(config));

export const regenerateTsConfig = (config: ConfigFile) => {
  updateTSConfig(config, (oldConfig) => {
    return {
      ...oldConfig,
      include: [
        `${config.in}/**/*.tsx`,
        `${config.in}/**/*.jsx`,
        `${config.in}/**/*.ts`,
        `${config.in}/**/*.js`,
        `${config.in}/graphql-ssg.d.ts`,
      ],
    };
  });
};

export const regenerateJsConfig = (config: ConfigFile) => {
  updateJSConfig((oldConfig) => {
    return {
      ...oldConfig,
      include: [`${config.in}/**/*.js`, `${config.in}/graphql-ssg.d.ts`],
    };
  });
};

export const updateTSConfig = (
  config: ConfigFile,
  fn: (config: any) => any,
) => {
  fs.writeFileSync(
    './tsconfig.json',
    JSON.stringify(fn(getTsConfig(config)), null, 2),
  );
};

export const updateJSConfig = (fn: (config: any) => any) => {
  fs.writeFileSync(
    './jsconfig.json',
    JSON.stringify(fn(getJsConfig()), null, 2),
  );
};
