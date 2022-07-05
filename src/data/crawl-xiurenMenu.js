const axios = require("axios");
const cheerio = require('cheerio');

// Global Variable
let subMenu = [];

let crawlXiurenMenu = async function () {
    let fullUrl = 'https://mrcong.com/';
    console.log("URL: " + fullUrl);
    try {
        await axios(fullUrl)
            .then(async(res) => {
                const html = res.data;
                const $ = cheerio.load(html);
                $("ul.sub-menu.menu-sub-content > li.menu-item").each(function(index, el){
                    let link = $(this).find('a').attr("href");
                    let tagName = $(this).find('a').text();
                    subMenu.push({tagName,link});
                    // console.log("Index: " + index + " - link: " + link + " - name: " + name);
                    
                })

            })
            .catch((err) => {
                // console.log("Some thing wrong when crawl xiuren PHOTO data");
                console.log(err);
                return false;
            })
        return true;
    } catch (error) { }
}




//Run

async function crawlMenu(){
    await crawlXiurenMenu();
    return subMenu;
}

module.exports = {
    crawlMenu
}