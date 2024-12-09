const puppeteer = require('puppeteer');

async function scrapeMyntraProduct(url) {
 const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for key element to load
    await page.waitForSelector('.pdp-title', { timeout: 10000 });

    // Extract data
    const productData = await page.evaluate(() => {
      const title = document.querySelector('.pdp-title')?.innerText.trim() || 'N/A';
      const price = document.querySelector('.pdp-price')
        ? parseInt(document.querySelector('.pdp-price').innerText.replace(/[^\d]/g, ''), 10)
        : null;

      const discountPrice = document.querySelector('.pdp-offers-price')
        ? parseInt(document.querySelector('.pdp-offers-price').innerText.replace(/[^\d]/g, ''), 10)
        : null;

      const description = Array.from(
        document.querySelectorAll('.pdp-description-container .index-row')
      )
        .map((el) => el.innerText.trim())
        .join('\n') || 'No description available';

     
        const divElement = document.querySelector('.image-grid-image'); 
        const style = divElement.style.backgroundImage; 
        const img_url = style.match(/url\("(.*?)"\)/)?.[1];
        const image = img_url || 'No image available';

      const copanDescription = document.querySelector('.pdp-offers-offerDesc')?.innerText.trim() || 'No coupon description';
      const coupanCode = document.querySelector('.pdp-offers-labelMarkup')?.innerText.trim() || 'No coupon code';

      return {
        title,
        price,
        description,
        image,
        discountPrice,
        copanDescription,
        coupanCode,
      };
    });

    console.log('Scraped Product Data:', productData);
    return productData;

  } catch (error) {
    console.error('Error scraping Myntra:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}



module.exports = {
  scrapeMyntraProduct,
};