const axios = require("axios");
const cheerio = require('cheerio');

let nameList = [];
let count = 0;

let crawlAllData = async function (firstChar) {
    const url = `https://jav.fandom.com/wiki/Category:Female?from=${firstChar}`;
    try {
        let result = [];
        await axios(url).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);
            let ID = '';
            let i = 1;
            $("li.category-page__member").each(function () {
                const name = $(this).find('a').attr('title');
                let url = $(this).find('a').attr('href');
                let image = $(this).find('a > img').attr('data-src');
                let index = image.indexOf("/revision");
                image = image.substring(0, index);

                // check if not have name in Alphabet list
                if (name[0] != firstChar) {
                    return;
                }

                ID = firstChar + i;
                result.push({
                    id: ID,
                    firstChar: firstChar,
                    name: name,
                    url: `/JavStar/Actress/Detail${url.split('/wiki')[1]}`,
                    image: image
                });

            })
            nameList = nameList.concat(result);
        })
        return result;

    } catch (error) {
        console.log(error);
    }
}

// Run

async function crawlAllJavStar(firstChar) {
    nameList = new Array;
    let alphabet = firstChar
    if (!alphabet) {
        alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    }

    for (let char of alphabet) {
        console.log("char: ", char);
        await crawlAllData(char);
    }
    return nameList;
}

async function findActress(searchText) {
    await crawlAllJavStar('');
    return nameList.filter((actress, index) => (actress.name).toLowerCase().includes((searchText.toLowerCase())));
}

module.exports = {
    crawlAllJavStar,
    findActress
}