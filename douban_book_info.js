const puppeteer = require('puppeteer');

async function getDoubanBookInfo(bookUrl) {
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();

  await page.goto(bookUrl, { timeout: 0 });

  // Wait for the book information to load
  await page.waitForSelector('#wrapper');



  // Extract the book information
  const bookInfo = await page.evaluate(() => {

    const titleEl = document.querySelector('#wrapper h1 span');
    // const coverEl = document.querySelector('#mainpic img');
    const ratingEl = document.querySelector('#interest_sectl .rating_num');
    const introEl = document.querySelector('.hidden .intro') || document.querySelector('#link-report .intro')


    // Extract the relevant data from the book page
    const title = titleEl ? titleEl.textContent.trim() : '';
    // const cover = coverEl ? coverEl.src : '';
    const rating = ratingEl ? ratingEl.textContent.trim() : '';

    let intro = '';
    if (introEl) {
      const intro_p = introEl.querySelectorAll('p');
      intro_p.forEach(p => {
        intro += p.textContent.trim();
        intro += '\n';
        intro += '\n';
      });
    }




    // Return the book information as an object
    return {
      title,
      rating,
      intro
    };
  });

  await browser.close();

  return bookInfo;
}




// Example usage: get information for "The Great Gatsby" book
// getDoubanBookInfo('https://book.douban.com/subject/25660928/').then(info => {
//   console.log(info);
// });

module.exports = getDoubanBookInfo;
