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
