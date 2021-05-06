import chokidar from 'chokidar';
import liveServer from 'live-server';
import { ConfigFile, readConfig } from './config';
import { copyCssFiles, copyFile, readFiles, transformFiles } from './transform';
import path from 'path';
import WebSocket from 'ws';
import http from 'http';
import { browserHtml } from '@/browserHtml';
import { runBrowser } from '@/browser';
import { createServer } from 'net';
import fs from 'fs';

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

const initBrowserBundler = async (configFile: ConfigFile) => {
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
    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(browserHtml(configFile));
    res.end();
  });
  const browserBundlePort = await getPort(configFile.port + 1);
  browserBundle.listen(browserBundlePort);
  const browser = await runBrowser(browserBundlePort);
  return {
    browserBundle,
    ws,
    browser,
  };
};

export const build = async () => {
  const configFile = readConfig('./graphql-ssg.json');
  const { browser, browserBundle, ws } = await initBrowserBundler(configFile);
  await transformAllFiles(configFile);
  copyCssFiles(configFile);
  ws.close();
  browserBundle.close();
  await browser.close();
};

const transformSingleFile = async (
  configFile: ConfigFile,
  individualFile: string,
) => {
  await transformFiles(configFile, [individualFile]);
};
const transformAllFiles = async (configFile: ConfigFile) => {
  const allFiles = readFiles(configFile.in);
  await transformFiles(configFile, allFiles);
};

export const watch = async () => {
  const configFile = readConfig('./graphql-ssg.json');
  await initBrowserBundler(configFile);
  chokidar
    .watch(path.join(configFile.in, `**/*.{js,css}`), {
      interval: 0, // No delay
    })
    .on('all', async (event, p) => {
      if (p.endsWith('.css')) {
        copyFile(configFile, path.relative(configFile.in, p));
        return;
      }
      const jsFilePath = p.substr(0, p.lastIndexOf('.')) + '.js';
      if (fs.existsSync(jsFilePath)) {
        const filePath = path.relative(configFile.in, jsFilePath);
        await transformSingleFile(configFile, filePath);
      }
    });
  copyCssFiles(configFile);
  await transformAllFiles(configFile);
  // `liveServer` local server for hot reload.
  return liveServer.start({
    open: true,
    port: configFile.port,
    root: './out',
  });
};
