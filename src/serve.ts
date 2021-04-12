import chokidar from 'chokidar';
import liveServer from 'live-server';
import { readConfig } from './config';
import { generateGlobalFile, readFiles, transformFiles } from './transform';
import path from 'path';
import WebSocket from 'ws';
import http from 'http';
import { browserHtml } from '@/browserHtml';
import { runBrowser } from '@/browser';

import { createServer } from 'net';

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
  runBrowser(browserBundlePort);
  liveServer.start({
    open: true,
    port: configFile.port,
    root: 'out',
  });
};
