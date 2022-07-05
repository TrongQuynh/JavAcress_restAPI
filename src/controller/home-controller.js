const crawlData = require('../data/crawl-data');
const crawlMenu = require("../data/crawl-xiurenMenu");

class homeController{
    // [GET] /Heaven
    async get(req,res,next){
        let data = await crawlData.crawlAllJavStar('Y');
        let subMenu = await crawlMenu.crawlMenu();
        if (!data) {
            res.json({ Message: "Something Wrong!" })
            return;
        }

        let result = data.slice(0, 8);
        res.render("home", { result, subMenu });
    }
}

module.exports = new homeController();