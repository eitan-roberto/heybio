const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://heybio.vercel.app');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: '/home/node/.openclaw/workspace/screenshots/01-homepage-desktop.png', fullPage: true });
  
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: '/home/node/.openclaw/workspace/screenshots/02-homepage-mobile.png', fullPage: true });
  
  await browser.close();
  console.log('Homepage screenshots saved!');
})();
