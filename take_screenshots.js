const puppeteer = require('puppeteer');
const path = require('path');

const OUT_DIR = "C:\\Users\\DELL\\.gemini\\antigravity\\brain\\2b53bdb2-ddc1-41fb-8318-bac34fb5722e";
const URL = "https://fin-flow-expense-tracker-2krnwhwt3-jnaneshmr-s-projects1.vercel.app";

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to login page...");
  await page.goto(URL + '/login', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_login_page.png') });
  console.log("Saved login page screenshot.");

  console.log("Logging in...");
  await page.type('input[type="email"]', 'alex@finflow.app');
  await page.type('input[type="password"]', 'demo1234');
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '02_dashboard.png') });
  console.log("Saved dashboard screenshot.");

  console.log("Navigating to transactions...");
  await page.goto(URL + '/transactions', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Opening Add Transaction modal...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Add Transaction'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '03_form.png') });
  console.log("Saved form screenshot.");

  console.log("Navigating to analytics...");
  await page.goto(URL + '/analytics', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '04_reports.png') });
  console.log("Saved reports screenshot.");

  await browser.close();
  console.log("Done!");
})();
