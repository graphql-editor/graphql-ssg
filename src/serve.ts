import chokidar from 'chokidar';
import liveServer from 'live-server';
import fs from 'fs';
import { bundle } from './module';

const cssFile = '.mock.css';
const jsFile = '.mock.zeus.js';
const mockRegex = /([^.]*)?(\.|^)mock.*$/;

interface ConfigFile {
  url: string;
}

export const build = async () => {
  const files = fs.readdirSync('./sandbox');
  const allFiles: (string | undefined)[] = [];
  const configFile: ConfigFile = JSON.parse(
    fs.readFileSync('./sandbox/graphql-ssg.json').toString('utf8'),
  );
  if (!configFile) {
    throw new Error('No graphql schema');
  }
  files.forEach((f) => {
    const regexResult = f.match(mockRegex);
    if (regexResult && regexResult.length > 1) {
      const fileName = regexResult[1];
      if (!allFiles.includes(fileName)) {
        allFiles.push(fileName);
      }
    }
  });
  const htmlFiles = await Promise.all(
    allFiles.map(async (af) => ({
      name: `${af || 'index'}.html`,
      content: await bundle(
        configFile.url,
        fs
          .readFileSync(`./sandbox/${af ? `${af}${jsFile}` : 'mock.zeus.js'}`)
          .toString('utf8'),
        fs
          .readFileSync(`./sandbox/${af ? `${af}${cssFile}` : 'mock.css'}`)
          .toString('utf8'),
      ),
    })),
  );
  htmlFiles.forEach((f) => {
    fs.writeFileSync(`./out/${f.name}`, f.content);
  });
};

export const watch = async () => {
  chokidar
    .watch('sandbox/**/*.{ts,js,css}', {
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
