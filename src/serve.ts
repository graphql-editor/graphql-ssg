import chokidar from 'chokidar';
import liveServer from 'live-server';
import { ConfigFile, readConfig, regenerateTsConfig } from './config';
import {
  copyCssFiles,
  copyFile,
  generateTypingsFiles,
  readFiles,
  transformFiles,
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
import { DryadFunctionBodyString } from '@/fn';

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
  configFile,
  schema,
}: {
  configFile: ConfigFile;
  schema: string;
}) => {
  const ws = new WebSocket.Server({
    port: configFile.websocketPort,
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
      res.write(browserHtml(configFile));
    } else {
      const [, , ...fileNames] = requestURL.split('/');
      const fileName = fileNames.join('/');
      if (fileName?.endsWith('.js')) {
        const filePath = path.join(configFile.in, fileName);
        const dryad = DryadFunctionBodyString({
          schema,
          configFile,
        });
        //TODO: bundling goes here
        const pathContent = fs.readFileSync(filePath).toString('utf-8');
        const fContent = [dryad, internals(configFile), pathContent].join('\n');

        res.writeHead(200, { 'content-type': 'text/javascript' });
        res.write(fContent);
      }
    }
    res.end();
  });
  const browserBundlePort = await getPort(configFile.port + 1);
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
  const configFile = readConfig('./graphql-ssg.json');
  regenerateTsConfig(configFile);
  const schema = await Utils.getFromUrl(configFile.url, configFile.headers);
  const { close } = await initBrowserBundler({
    configFile,
    schema,
  });
  await transformAllFiles({ configFile, schema });
  copyCssFiles(configFile);
  await generateTypingsFiles(configFile);
  await close();
};

const transformAllFiles = async ({
  configFile,
  schema,
}: {
  configFile: ConfigFile;
  schema: string;
}) => {
  const allFiles = readFiles(configFile.in);
  await transformFiles({
    configFile,
    files: allFiles,
    schema,
  });
};

export const watch = async () => {
  let block = true;
  const configFile = readConfig('./graphql-ssg.json');
  const schema = await Utils.getFromUrl(configFile.url, configFile.headers);
  await build();
  await initBrowserBundler({
    configFile,
    schema,
  });
  chokidar
    .watch(path.join(configFile.in, `**/*.{js,css}`), {
      interval: 0, // No delay
    })
    .on('all', async (event, p) => {
      if (block) {
        return;
      }
      if (p.match(/\.css$/)) {
        copyFile(configFile, path.relative(configFile.in, p));
        return;
      }
      if (p.match(/\.(png|gif|jpg|webp|svg|json)$/)) {
        copyFile(configFile, path.relative(configFile.in, p));
        return;
      }
      const jsFilePath = p.substr(0, p.lastIndexOf('.')) + '.js';
      if (fs.existsSync(jsFilePath)) {
        block = true;
        await transformAllFiles({
          configFile,
          schema,
        });
        block = false;
      }
    });
  block = false;
  // `liveServer` local server for hot reload.
  return liveServer.start({
    open: true,
    port: configFile.port,
    root: './out',
  });
};
