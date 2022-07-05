const axios = require("axios");
const cheerio = require('cheerio');

let crawlInfoActress = async function (name) {
    const url = `https://jav.fandom.com/wiki/${name}`;
    try {
        let infoActress = {};
        await axios(url).then((res) => {
            // console.log("res" , res.status());
            const html = res.data;
            const $ = cheerio.load(html);
            const titleName = $("aside[role] > h2").text();
            let imgUrl = $('.image-thumbnail img').attr('src');
            let index = imgUrl.indexOf('/revision')
            imgUrl = imgUrl.slice(0, index);

            infoActress["titleName"] = titleName;
            infoActress["img"] = imgUrl;

            // get All Account
            let accountList = {};
            $(".mw-parser-output > ul > li > a").each(function(){
                accountList[$(this).text()] = $(this).attr("href");
            })

            $("aside[role] > section").each(function () {
                let propertyList = [];
                let infoList = [];
                let info = {};
                let typeData = $(this).find("h2").text().replaceAll(" ","_");
                // Get All Property.
                $(this).find("div > h3")
                    .each(function () {
                        let property = $(this).text();
                        // property = property.replaceAll(" ","_").replaceAll("-","_");
                        propertyList.push(property);
                    })

                //Get all value of property.
                $(this).find("div > div")
                    .each(function () {
                        let value = $(this).text();
                        infoList.push(value);
                    })

                for (let i = 0; i < propertyList.length; i++) {
                    info[propertyList[i]] = infoList[i];
                }
                infoActress[typeData] = info;
            })
            infoActress.Social_Media = accountList;
            
        })
        return infoActress;
        
    } catch (error) {
        console.log("Error when crawl data");
        return null;
    }
}

async function run() {
    await crawlInfoActress("AIKA");
}

run();
exports.crawlInfoActress = crawlInfoActress;