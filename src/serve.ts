import chokidar from 'chokidar';
import liveServer from 'live-server';
import { ConfigFile, readConfig, regenerateJsConfig } from './config';
import {
  copyStaticFiles,
  generateTypingsFiles,
  readFiles,
  transformFiles,
  fileRegex,
  typingsRegex,
  cleanBuild,
} from './transform';
import path from 'path';
import WebSocket from 'ws';
import http from 'http';
import { browserHtml } from '@/browserHtml';
import { runBrowser } from '@/browser';
import { createServer } from 'net';
import fs from 'fs';
import { parse } from 'dotenv';
import { Utils } from 'graphql-zeus';

const envs = () =>
  fs.existsSync('./.env') ? parse(fs.readFileSync('./.env')) : {};

const internals = (config: ConfigFile, build?: boolean) => {
  const ssg = {
    env: envs(),
    config,
    host: build ? `http://0.0.0.0:${config.port}` : '.',
  };
  return `const ssg = ${JSON.stringify(ssg, null, 4)}`;
};

const getPort = (port = 80, maxPort = 65535): Promise<number> => {
  if (maxPort < port) {
    return Promise.reject(
      (() => {
        const e = new Error('EPORTSPEC');
        return e;
      })(),
    );
  }
  const server = createServer();
  return new Promise((resolve, reject) =>
    server
      .once('error', (error) =>
        ++port > maxPort ? reject(error) : server.listen(port),
      )
      .once('listening', () => server.close(() => resolve(port)))
      .listen(port),
  );
};

const initBrowserBundler = async ({
  config,
  schema,
}: {
  config: ConfigFile;
  schema: string;
}) => {
  const ws = new WebSocket.Server({
    port: config.websocketPort,
    perMessageDeflate: true,
  });
  ws.on('connection', (client) => {
    client.send(JSON.stringify({ type: 'connected' }));
    client.on('message', (e) => {
      ws.clients.forEach((v) => {
        v.send(e);
      });
    });
  });
  const browserBundle = http.createServer((req, res) => {
    const requestURL = req.url;
    if (requestURL === '/' || !requestURL) {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(browserHtml(config));
    } else {
      const [, , ...fileNames] = requestURL.split('/');
      const fileName = fileNames.join('/');
      if (fileName?.endsWith('.js') || fileName?.endsWith('.mjs')) {
        const filePath = path.join(config.in, fileName);
        const pathContent = fs.readFileSync(filePath).toString('utf-8');
        const fContent = [internals(config), pathContent].join('\n');
        res.writeHead(200, { 'content-type': 'text/javascript' });
        res.write(fContent);
      }
    }
    res.end();
  });
  const browserBundlePort = await getPort(config.port + 1);
  browserBundle.listen(browserBundlePort);
  const browser = await runBrowser(browserBundlePort);
  return {
    browserBundle,
    ws,
    browser,
    close: async () => {
      ws.close();
      browserBundle.close();
      await browser.close();
    },
  };
};

export const build = async () => {
  const config = readConfig('./graphql-ssg.json');
  cleanBuild(config);
  regenerateJsConfig(config);
  const schema = await Utils.getFromUrl(config.url, config.headers);
  await generateTypingsFiles({ config, schema });
  const { close } = await initBrowserBundler({
    config,
    schema,
  });
  await transformAllFiles({ config, schema });
  copyStaticFiles(config);
  await close();
};

const transformAllFiles = async ({
  config,
  schema,
}: {
  config: ConfigFile;
  schema: string;
}) => {
  const allFiles = await readFiles(config.in);
  await transformFiles({
    config,
    files: allFiles,
    schema,
  });
};

export const watch = async () => {
  let block = true;
  const config = readConfig('./graphql-ssg.json');
  const schema = await Utils.getFromUrl(config.url, config.headers);
  await build();
  await initBrowserBundler({
    config,
    schema,
  });
  chokidar
    .watch(path.join(config.in, `**/*.{js,css}`), {
      interval: 0, // No delay
    })
    .on('all', async (event, p) => {
      if (block) {
        return;
      }
      const isStaticFile = !(p.match(fileRegex) || p.match(typingsRegex));
      if (isStaticFile) {
        copyStaticFiles(config);
        return;
      }
      const jsFilePath = p.substr(0, p.lastIndexOf('.')) + '.js';
      if (fs.existsSync(jsFilePath)) {
        block = true;
        await transformAllFiles({
          config,
          schema,
        });
        block = false;
      }
    });
  block = false;
  // `liveServer` local server for hot reload.
  return liveServer.start({
    open: true,
    port: config.port,
    root: './out',
  });
};
