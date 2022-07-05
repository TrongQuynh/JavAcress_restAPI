const axios = require("axios");
const cheerio = require('cheerio');

// Global Variable
let result = [];
let totalPage = 0;
let pageTitle = "Xiuren";
let pageDescript = "";
let subMenu = [];
let hotAlbum = [];
let albumJustPorted = [];

let crawlData = async function (url, isCrawlTopAlbum) {
    console.log("URL: " + url);
    try {
        await axios(url)
            .then((res) => {
                const html = res.data;
                const $ = cheerio.load(html);

                // Crawl Title and Descript Page
                pageTitle = isCrawlTopAlbum ? $("h1.page-title").text() : $("h1.page-title > span").text();
                pageDescript = isCrawlTopAlbum ? $(".content > p:first").text() : $(".page-head > .archive-meta > p").text();

                // crawl sub menu
                $("ul.sub-menu.menu-sub-content > li.menu-item").each(function () {
                    let link = $(this).find('a').attr("href").replaceAll("https://mrcong.com/", "/Heaven/Xiuren/");
                    let tagName = $(this).find('a').text();
                    subMenu.push({ link, tagName });
                })

                console.log("\n--- Sub Menu ---");
                console.table(subMenu);

                if (isCrawlTopAlbum) {
                    // Crawl Album Just Ported
                    $("#posts-list-widget-4 > .widget-container > ul > li").each(function () {
                        let thumbnail = $(this).find(".post-thumbnail > a > img").attr("src");
                        let albumLink = $(this).find(".post-thumbnail > a").attr("href").replaceAll("https://mrcong.com/","/Heaven/Xiuren/");
                        let albumName = $(this).find("h3 > a").text();
                        albumJustPorted.push({
                            thumbnail,
                            albumLink,
                            albumName
                        })
                    })
                }

                if (!isCrawlTopAlbum) {
                    // crawl HOT section
                    $(".widget-grid-view-image").each(function () {
                        let hotThumbnail = $(this).find("a > img").attr("src");
                        let link = $(this).find('a').attr("href").replaceAll("https://mrcong.com/", "/Heaven/Xiuren/");
                        let title = $(this).find('a').attr("title");
                        hotAlbum.push({ hotThumbnail, link, title });
                    })
                }

                console.log("\n--- Hot Album ---");
                console.table(hotAlbum);

                // Get Model List
                $("article.item-list").each(function (index, el) {
                    let title = $(this).find("h2 > a").text();
                    let view = $(this).find(".post-meta > .post-views").text();
                    let thumbnail = $(this).find(".post-thumbnail > a >img").attr("src");
                    let albumName = $(this).find("h2.post-box-title > a").attr("href").replaceAll("https://mrcong.com/", "").replaceAll("/", "");
                    let tags = [];
                    $(this).find(".post-cats > a").each(function () {
                        let tagName = $(this).text();
                        tags.push(tagName);
                    })

                    let photoModel = {
                        title,
                        view,
                        thumbnail,
                        tags,
                        albumName
                    };
                    result.push(photoModel);
                })
                console.log("\n--- Photo Model ---");
                console.table(result);
                // Crawl total Page

                let lastPage = $(".pagination > a:last").text();
                if (Number(lastPage) > totalPage) {
                    totalPage = Number(lastPage);
                }

            })
            .catch((err) => {
                // console.log("Some thing wrong when crawl xiuren data");
                console.log(err);
                return false;
            })
        return true;
    } catch (error) { }
}

// RUN

async function crawlAllPage() {
    for (let page = 1; ; page++) {
        await crawlData(page);
    }
}

async function crawlModelByTagnameAtPage(currentPage, tagName) {
    result.length = 0;
    subMenu.length = 0;
    hotAlbum.length = 0;
    // tagname = tagname.replaceAll(" ", "-");
    tagName = encodeURIComponent(tagName); // Escape String Ex: "小果冻儿jelly" => "%e5%b0%8f%e6%9e%9c%e5%86%bb%e5%84%bfjelly"
    totalPage = currentPage;
    let url = currentPage < 2 ? `https://mrcong.com/tag/${tagName}` : `https://mrcong.com/tag/${tagName}/page/${currentPage}`;
    await crawlData(url, false);
    return {
        modelList: result,
        totalPage: totalPage,
        pageTitle,
        pageDescript,
        subMenu,
        hotAlbum
    };
}

async function crawlTopXiuren(top) {
    totalPage = 1;
    result.length = 0;
    subMenu.length = 0;
    albumJustPorted.length = 0;
    let url = `https://mrcong.com/${top}`;
    await crawlData(url, true);
    return {
        subMenu,
        pageTitle,
        pageDescript,
        modelList: result,
        totalPage: totalPage,
        albumJustPorted
    }
}

crawlModelByTagnameAtPage(1, "小果冻儿jelly");

module.exports = {
    crawlAllPage,
    crawlModelByTagnameAtPage,
    crawlTopXiuren
}