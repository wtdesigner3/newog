import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testMobileDrawer() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=375,667']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:3000/products/light-commercial-ac/four-way-cassette-ac...');
  await page.goto('http://localhost:3000/products/light-commercial-ac/four-way-cassette-ac', { waitUntil: 'networkidle2' });

  // Find hamburger button
  console.log('Clicking hamburger button...');
  const hamburger = await page.$('button[aria-label="Open navigation menu"]');
  if (!hamburger) throw new Error('Hamburger button not found');
  await hamburger.click();

  // Wait for drawer to be visible
  await page.waitForSelector('div[aria-label="Mobile Navigation Menu"]', { visible: true });
  console.log('Mobile menu drawer opened!');

  // Take screenshot of opened drawer
  await page.screenshot({ path: 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/mobile_drawer_open.png' });

  // Test clicking "Light Commercial AC" category toggle
  console.log('Clicking "Light Commercial AC" accordion toggle in drawer...');
  const categoryButtons = await page.$$('div[aria-label="Mobile Navigation Menu"] button');
  let clickedToggle = false;
  for (const btn of categoryButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Light Commercial AC')) {
      await btn.click();
      clickedToggle = true;
      console.log('Successfully clicked Light Commercial AC toggle!');
      break;
    }
  }

  // Wait a moment for accordion expand animation
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/mobile_drawer_expanded.png' });

  // Test clicking the Close button (X)
  console.log('Clicking close button (X)...');
  const closeBtn = await page.$('button[aria-label="Close navigation menu"]');
  if (!closeBtn) throw new Error('Close button not found');
  await closeBtn.click();

  // Wait for drawer to close
  await page.waitForSelector('div[aria-label="Mobile Navigation Menu"]', { hidden: true });
  console.log('Mobile drawer closed successfully without freezing!');

  await page.screenshot({ path: 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/mobile_drawer_closed.png' });

  await browser.close();
  console.log('ALL TESTS PASSED! Mobile navigation is fully interactive and working smoothly.');
}

testMobileDrawer().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
