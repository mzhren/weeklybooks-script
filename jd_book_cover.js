const puppeteer = require('puppeteer');

async function getJDBookCover(bookName) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(`https://search.jd.com/Search?keyword==${encodeURIComponent(bookName)}`, { timeout: 0 });

    // Wait for the search results to load
    await page.waitForSelector('#J_goodsList');

    // Extract the search results
    const searchResults = await page.evaluate(() => {

        const item = document.querySelector('#J_goodsList .gl-i-wrap');
        const pimg = item.querySelector('.p-img img').src;

        return pimg;
    });

    await browser.close();

    return searchResults;
}

// searchJDBooks('somebookname').then(results => {
//   console.log(results);
// });

module.exports = getJDBookCover;
