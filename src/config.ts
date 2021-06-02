import { existsJSONOrDefaultSync } from '@/fsAddons';
import fs from 'fs';

const GLOBAL_CONFIG_FILE = {
  out: './out',
  in: './pages',
  port: 8080,
  websocketPort: 1414,
};

export type ConfigFile = typeof GLOBAL_CONFIG_FILE & {
  graphql?: {
    [x: string]: {
      url: string;
      headers?: {
        [x: string]: string;
      };
    };
  };
  mode?: 'typescript' | 'jsx';
};

export const validateConfig = (config: ConfigFile) => {
  const errors: string[] = [];
  // Validate config
  Object.keys(GLOBAL_CONFIG_FILE).forEach((key) => {
    const v = config[key as keyof ConfigFile];
    if (typeof v === 'undefined' || v === null) {
      errors.push(
        `Invalid config file. Please include "${key}" in your config`,
      );
    }
  });
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};

export const readConfig = (path: string) => {
  const configExists = fs.existsSync(path);
  if (!configExists) {
    throw new Error('No config for graphql-ssg please create one using init');
  }
  const config: ConfigFile = JSON.parse(fs.readFileSync(path).toString('utf8'));
  validateConfig(config);
  return config;
};

export const initConfig = async () => {
  fs.writeFileSync(
    'graphql-ssg.json',
    JSON.stringify(GLOBAL_CONFIG_FILE, null, 4),
  );
};

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
    baseUrl: config.in,
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

export const updateTSConfig = (c: ConfigFile, fn: (config: any) => any) => {
  fs.writeFileSync(
    './tsconfig.json',
    JSON.stringify(
      fn(existsJSONOrDefaultSync('./tsconfig.json', TSConfig(c))),
      null,
      2,
    ),
  );
};

export const updateJSConfig = (fn: (config: any) => any) => {
  fs.writeFileSync(
    './jsconfig.json',
    JSON.stringify(
      fn(existsJSONOrDefaultSync('./jsconfig.json', JSConfig())),
      null,
      2,
    ),
  );
};
