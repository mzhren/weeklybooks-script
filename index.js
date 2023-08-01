const searchDoubanBooks = require('./douban_search_books');
const getDoubanBookInfo = require('./douban_book_info');
const getJDBookCover = require('./jd_book_cover');
const fs = require('fs');

const get_files = (dir) => {
    const files = fs.readdirSync(dir);
    // exclude .md files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.includes('.md')) {
            files.splice(i, 1);
        }
    }
    return files;
}

const current_dir = process.argv.slice(2);
console.log(current_dir);

const get_book_links = async (files) => {
    const book_links = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const book_name = file.split('.')[0];
        const book_link = await searchDoubanBooks(book_name);
        if (book_link.length > 0) {
            book_links.push(book_link[0].url);
        }
    }
    return book_links;
}

const files = get_files(current_dir[0]);

get_book_links(files).then(async (book_links) => {
    console.log(book_links);
    books_info = [];
    for (let i = 0; i < book_links.length; i++) {
        const book_link = book_links[i];
        let info = await getDoubanBookInfo(book_link)
        info.cover = await getJDBookCover(info.title);
        books_info.push(info);
    }


    const markdown = await json_to_markdown(books_info);
    console.log(markdown);
    write_to_file(markdown);

});

const get_current_week_order = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return currentWeek;
}

const json_to_markdown = async (books_info) => {

    let titles = books_info.map((book) => book.title).join('、');
    let markdown = '';
    markdown += titles;
    markdown += "\n\n";
    const current_week_order = get_current_week_order();
    markdown += `
本周是2023年第${current_week_order}周，本周推荐书单均来自群友推荐。欢迎大家在群里推荐书籍，我们会在每周整理出来。也欢迎您的加入，可先加群主微信（微信号：gameboy1000）备注“加群”，群主会拉你进群。
`;

    for (let i = 0; i < books_info.length; i++) {
        const book_info = books_info[i];
        markdown += `
       
## ${book_info.title}

![${book_info.title}](${book_info.cover})

评分：${book_info.rating}

${book_info.intro}
        `;
    }

    markdown += `

### 往期推荐

+ 推荐
+ 推荐
+ 推荐
+ 推荐
+ 推荐

> 关注 码农真经
>
> 点赞、转发、广告，更多优质资源等你来...
>
>( 2023${current_week_order} )

欢迎关注我的公众号“**码农真经**”，原创技术文章第一时间推送。
`;
    console.log(markdown)
    return markdown;
}

const write_to_file = (markdown) => {
    const markdown_file = current_dir[0] + '/books.md';
    fs.writeFileSync(markdown_file, markdown);
}
