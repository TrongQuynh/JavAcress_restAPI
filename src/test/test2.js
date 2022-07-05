const axios = require("axios");
const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');

let fullUrl = `https://mrcong.com/top3/`;

// Global Variable
let result = [];
let totalPage = 0;
let pageTitle = "Xiuren";
let pageDescript = "";

let crawlData = async function (currentPage, tagName) {
    // let url = currentPage < 2 ? `https://mrcong.com/tag/${tagName}` : `https://mrcong.com/tag/${tagName}/page/${currentPage}`;
    let url = fullUrl
    console.log("URL: " + url);
    try {
        await axios(url)
            .then((res) => {
                const html = res.data;
                const $ = cheerio.load(html);
                let albumJustPorted = [];
                $("#posts-list-widget-4> .widget-container > ul > li").each(function () {
                    let thumbnail = $(this).find(".post-thumbnail > a > img").attr("src");
                    let albumLink = $(this).find(".post-thumbnail > a").attr("href").replaceAll("https://mrcong.com/","http://localhost:8000/Heaven/Xiuren/");
                    let albumName = $(this).find("h3 > a").text();
                    albumJustPorted.push({
                        thumbnail,
                        albumLink,
                        albumName
                    })
                })
                console.log(albumJustPorted);
              
            })
            .catch((err) => {
                console.log("Some thing wrong when crawl xiuren data");
                return false;
            })
        return true;
    } catch (error) { }
}



async function crawlModelByTagnameAtPage(page, tagname) {
    result.length = 0;
    // tagname = tagname.replaceAll(" ", "-");
    tagname = encodeURIComponent(tagname); // Escape String Ex: "小果冻儿jelly" => "%e5%b0%8f%e6%9e%9c%e5%86%bb%e5%84%bfjelly"
    await crawlData(page, tagname);
    return {
        modelList: result,
        totalPage: totalPage,
        pageTitle
    };
}

crawlModelByTagnameAtPage(1, "小果冻儿jelly");