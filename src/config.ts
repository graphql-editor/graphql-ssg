import fs from 'fs';

const GLOBAL_CONFIG_FILE = {
  url: 'https://example.org/graphql',
  out: './out',
  in: './pages',
  port: 8080,
  websocketPort: 1414,
};

export type ConfigFile = typeof GLOBAL_CONFIG_FILE & {
  headers?: string[];
};

export const validateConfig = (configFile: ConfigFile) => {
  const errors: string[] = [];
  // Validate config
  Object.keys(GLOBAL_CONFIG_FILE).forEach((key) => {
    const v = configFile[key as keyof ConfigFile];
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
  const configFile: ConfigFile = JSON.parse(
    fs.readFileSync(path).toString('utf8'),
  );
  validateConfig(configFile);
  return configFile;
};

export const initConfig = async () => {
  fs.writeFileSync(
    'graphql-ssg.json',
    JSON.stringify(GLOBAL_CONFIG_FILE, null, 4),
  );
};

const TSConfig = (configFile: ConfigFile) => ({
  compilerOptions: {
    incremental: true /* Enable incremental compilation */,
    target:
      'es5' /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    module:
      'commonjs' /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
    strict: true /* Enable all strict type-checking options. */,
    esModuleInterop: true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    skipLibCheck: true /* Skip type checking of declaration files. */,
    forceConsistentCasingInFileNames: true /* Disallow inconsistently-cased references to the same file. */,
    allowJs: true,
    noEmit: true,
  },
  include: [`${configFile.in}/**/*.js`, `${configFile.in}/ssg.d.ts`],
});

export const regenerateTsConfig = (configFile: ConfigFile) => {
  const currentConfig = fs.existsSync('./tsconfig.json')
    ? JSON.parse(fs.readFileSync('./tsconfig.json').toString('utf-8'))
    : TSConfig(configFile);
  currentConfig.include = [
    `${configFile.in}/**/*.js`,
    `${configFile.in}/ssg.d.ts`,
  ];
  fs.writeFileSync('./tsconfig.json', JSON.stringify(currentConfig, null, 2));
};
