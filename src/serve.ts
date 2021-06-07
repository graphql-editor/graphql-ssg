import chokidar from 'chokidar';
import liveServer from 'live-server';
import { ConfigFile, readConfig } from './config';
import {
  copyStaticFiles,
  generateTypingsFiles,
  transformFiles,
  cleanBuild,
  generateBasicTypingsFiles,
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
import { isJSFile, isTSFile } from '@/fsAddons';
import { regenerateJsConfig, regenerateTsConfig } from '@/transpilerConfig';

const transformHeaders = (headers?: { [x: string]: string }) => {
  if (!headers) {
    return undefined;
  }
  return Object.keys(headers).map((k) => `${k}:${headers[k]}`);
};

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

const initBrowserBundler = async ({ config }: { config: ConfigFile }) => {
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

export const preBuild = async (config: ConfigFile) => {
  cleanBuild(config);
  if (config.mode) {
    regenerateTsConfig(config);
  } else {
    regenerateJsConfig(config);
  }
  await generateBasicTypingsFiles(config);
  if (config.graphql) {
    await Promise.all(
      Object.keys(config.graphql).map(async (k) => {
        const schema = await Utils.getFromUrl(
          config.graphql![k].url,
          transformHeaders(config.graphql![k].headers),
        );
        await generateTypingsFiles({ config, schema, name: k });
        return {
          schema,
          name: k,
        };
      }),
    );
  }
};

export const build = async () => {
  const config = readConfig('./graphql-ssg.json');
  await preBuild(config);
  const { close } = await initBrowserBundler({
    config,
  });
  await transformFiles({ config });
  copyStaticFiles(config);
  await close();
};

export const watch = async () => {
  let block = true;
  let liveServerRunning = false;
  const config = readConfig('./graphql-ssg.json');
  await preBuild(config);
  copyStaticFiles(config);
  await initBrowserBundler({
    config,
  });
  chokidar
    .watch(path.join(config.in, `**/*.{js,css,ts,tsx,jsx}`), {
      interval: 0, // No delay
    })
    .on('all', async (event, p) => {
      if (block) {
        return;
      }
      if (isJSFile(p) || isTSFile(p)) {
        if (fs.existsSync(p)) {
          block = true;
          await transformFiles({
            config,
          });
          if (!liveServerRunning) {
            liveServerRunning = true;
            liveServer.start({
              open: true,
              logLevel: 0,
              port: config.port,
              root: config.out,
            });
          }
          block = false;
        }
        return;
      }
      copyStaticFiles(config);
    });
  block = false;
  // `liveServer` local server for hot reload.
};
