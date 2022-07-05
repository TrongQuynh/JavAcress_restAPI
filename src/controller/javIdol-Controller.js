
const crawlData = require('../data/crawl-data');
const crawlInfo = require('../data/crawl-ActressInfo');
const crawlMenu = require("../data/crawl-xiurenMenu");

class JavIdolController {
    // [GET] /Heaven/Actress || /Heaven/Actress/?char&?page
    async showJavIdol(req, res, next) {
        let page = req.query.page || 1;
        let perPage = 12;

        let char = '';
        let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        let subMenu = await crawlMenu.crawlMenu();
        if (req.query.char) {
            char = req.query.char;
        }
        let data = await crawlData.crawlAllJavStar(char);
        if (!data) {
            return res.json({ Message: "Something Wrong!" })
        }

        let totalPages = Math.ceil(data.length / perPage); // total page
        let skip = ((page - 1) * perPage);
        let numberOfActress = data.length;
        // skip actress
        data = data.filter((actress, index) => index >= skip);
        // limit actress on page
        data = data.filter((actress, index) => index < (perPage));

        res.render('actress', {
            numberOfActress,
            data,
            alphabet,
            current: page,
            pages: totalPages,
            char,
            subMenu
        });
    }

    // [GET] /Heaven/Actress/Search?query&?page
    async searchJavIdol(req, res, next) {
        let query = req.query.query;
        let data = []
        if (!query) {
            return;
        }
        data = await crawlData.findActress(query);

        let page = req.query.page || 1;
        let perPage = 12;
        let skip = ((page - 1) * perPage);
        let numberOfActress = data.length;
        let totalPages = Math.ceil(data.length / perPage); // total page
        let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        let subMenu = await crawlMenu.crawlMenu();
        // skip actress
        data = data.filter((actress, index) => index >= skip);
        // limit actress on page
        data = data.filter((actress, index) => index < (perPage));
        res.render('actress', {
            numberOfActress,
            data,
            alphabet,
            current: page,
            pages: totalPages,
            char: "",
            subMenu
        });
    }

    // [GET] /Heaven/Actress/Detail/:name
    async showDetailInfoJavIdol(req, res, next) {
        let name = req.params.name;
        const actress = await crawlInfo.crawlInfoActress(name);
        let subMenu = await crawlMenu.crawlMenu();
        if (!actress) {
            return res.status(404).json({ message: "Not found actress" });
        }
        return res.status(200).render("actress-detail", {
            titleName: actress.titleName,
            image: actress.img,
            actress,
            subMenu
        });
    }
}

module.exports = new JavIdolController();