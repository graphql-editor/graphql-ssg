import puppeteer from 'puppeteer';

export const runBrowser = async (port: number) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}`);
};
