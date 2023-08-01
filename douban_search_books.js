const puppeteer = require('puppeteer');

async function searchDoubanBooks(bookName) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(`https://search.douban.com/book/subject_search?search_text=${encodeURIComponent(bookName)}`, {timeout: 0});

  // Wait for the search results to load
  await page.waitForSelector('#wrapper');

  // Extract the search results
  const searchResults = await page.evaluate(() => {
    const results = [];

    // Loop through each search result item
    document.querySelectorAll('#wrapper .detail').forEach(item => {
      const titleEl = item.querySelector('.title-text');

      if(!titleEl) {
        return;
      }

      // Extract the relevant data from the search result item
      const title = titleEl ? titleEl.textContent.trim() : '';
      const url = titleEl ? titleEl.getAttribute('href') : '';

      // if url contains series, skip
      if (url.includes('series')) {
        return;
      }

      // Add the search result data to the results array
      results.push({
        title,
        url
      });
    });

    return results;
  });

  await browser.close();

  return searchResults;
}

// searchDoubanBooks('史记').then(results => {
//   console.log(results);
// });

module.exports = searchDoubanBooks;
