const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  // Listen to network requests
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('BROWSER NETWORK REQUEST:', request.method(), request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('BROWSER NETWORK RESPONSE:', response.status(), response.url());
    }
  });

  console.log("Navigating to http://localhost:5174 ...");
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });

  // Look for the Navbar link or Get Started button to go to Analyze page
  const navLinks = await page.$$('a, button');
  for (const link of navLinks) {
    const text = await page.evaluate(el => el.textContent, link);
    if (text && (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('get started'))) {
      await link.click();
      break;
    }
  }

  // Look for the textarea and type the message
  await page.waitForSelector('textarea', { timeout: 10000 });
  await page.type('textarea', 'TESTMARKER123 URGENT: Your bank account is suspended. Click here to verify KYC: http://bit.ly/fake-kyc');

  // Click the Analyze button
  console.log("Submitting form...");
  
  // Find the button (assumes button contains 'Analyze' text or is a submit type)
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await page.evaluate(el => el.textContent, button);
    if (text && text.toLowerCase().includes('analyze')) {
      await button.click();
      break;
    }
  }

  // Wait a bit to let the network request complete
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await browser.close();
  console.log("Test finished.");
})();
