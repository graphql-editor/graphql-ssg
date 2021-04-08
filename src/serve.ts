import chokidar from 'chokidar';
import liveServer from 'live-server';
import { readConfig } from './config';
import { generateGlobalFile, readFiles, transformFiles } from './transform';
import path from 'path';

export const build = async () => {
  const configFile = readConfig('./graphql-ssg.json');
  await generateGlobalFile(configFile);
  const allFiles = readFiles(configFile.in);
  await transformFiles(configFile, allFiles);
};

export const watch = async () => {
  const configFile = readConfig('./graphql-ssg.json');
  chokidar
    .watch(path.join(configFile.in, `**/*.{js,css}`), {
      interval: 0, // No delay
    })
    .on('all', async () => {
      await build();
    });
  // `liveServer` local server for hot reload.
  liveServer.start({
    open: true,
    port: parseInt(process.env.PORT || '8080'),
    root: 'out',
  });
};
