const axios = require("axios");
const cheerio = require('cheerio');

// Global Variable
let album = {};
let recommendAlbumList = [];
let subMenu = [];

let crawlData = async function (albumName, currentPage) {
    let fullUrl = currentPage < 2 ? `https://mrcong.com/${albumName}` : `https://mrcong.com/${albumName}/${currentPage}`;
    try {
        await axios(fullUrl)
            .then(async(res) => {
                const html = res.data;
                const $ = cheerio.load(html);

                // crawl sub menu
                $("ul.sub-menu.menu-sub-content > li.menu-item").each(function(){
                    let link = $(this).find('a').attr("href").replaceAll("https://mrcong.com/","http://localhost:8000/JavStar/Xiuren/");
                    let tagName = $(this).find('a').text();
                    subMenu.push({link,tagName});
                })

                // let info = $(".box.info.aligncenter > .box-inner-block").text();
                let titlePage = $(".post-inner > h1 > span").text();
                let numberOfComment = $(".post-comments > a").text();
                let numberOfViews = $(".post-views").text();
                let linkDownloadMediaFire = $("a.shortc-button.medium.green ").attr("href");
                let linkDownloadAnonFiles = $("a.shortc-button.medium.black ").attr("href");

                // Crawl picture
                let listPhoto = [];
                $("p > img.aligncenter").each(function () {
                    let image = $(this).attr("src");
                    listPhoto.push(image);
                })

                // Crawl TagPage
                let tagList = [];
                $(".post-tag > a").each(function(){
                    let nameTag = $(this).text();
                    let linkTag = $(this).attr("href").replaceAll("https://mrcong.com/","/JavStar/Xiuren/");
                    tagList.push({
                        nameTag,
                        linkTag
                    })
                })

                //Get total Page
                let totalPage = currentPage;
                $(".page-link > a").each(function () {
                    let pageNumber = $(this).text();
                    totalPage = pageNumber > totalPage ? pageNumber : totalPage;
                })


                //Get recommend Album
                let linkToRecommendAlbum = $("p.post-tag > a:nth-child(2)").attr("href");
                await crawlRecommendAlbum(linkToRecommendAlbum);

                // Result
                album = {
                    titlePage,
                    numberOfComment,
                    numberOfViews,
                    linkDownloadAnonFiles,
                    linkDownloadMediaFire,
                    listPhoto,
                    totalPage,
                    recommendAlbumList,
                    tagList,
                    subMenu
                }

            })
            .catch((err) => {
                // console.log("Some thing wrong when crawl xiuren PHOTO data");
                console.log(err);
                return false;
            })
        return true;
    } catch (error) { }
}

async function crawlRecommendAlbum(url) {
    try {
        await axios(url).then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);

            $("article.item-list").each(function (index, el) {
                if (index >= 6) {
                    return;
                }
                let albumName = $(this).find("h2 > a").text();
                let thumbnail = $(this).find(".post-thumbnail > a > img").attr("src");
                let linkToAlbum = $(this).find(".post-thumbnail > a").attr("href").replaceAll("https://mrcong.com/","/JavStar/Xiuren/");
                recommendAlbumList.push({
                    albumName,
                    thumbnail,
                    linkToAlbum
                });
            })

        })
    } catch (error) { }
}


//Run
async function crawlPhotoAtPage(albumName, currentPage) {
    recommendAlbumList.length = 0;
    subMenu.length = 0;
    let result = await crawlData(albumName, currentPage);
    return result ? album : null;
}

crawlData("xiuren-no-4728-zhou-yuxi-sally-77-anh", 1);

module.exports = {
    crawlPhotoAtPage
}