import puppeteer from 'puppeteer';

export const runBrowser = async (port: number) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setCacheEnabled(false);
  await page.goto(`http://127.0.0.1:${port}`);
  return browser;
};
