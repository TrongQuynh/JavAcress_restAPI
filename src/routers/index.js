const express = require('express');
const crawlData = require('../data/crawl-data');
const crawlInfo = require('../data/crawl-ActressInfo');

function Router(app) {

    // [GET] /JavStar/Actress/Detail/:name
    app.get("/JavStar/Actress/Detail/:name", async (req, res) => {
        let name = req.params.name;
        const actress = await crawlInfo.crawlInfoActress(name);
        if (!actress) {
            return res.status(404).json({ message: "Not found actress" });
        }
        return res.status(200).render("actress-detail", {
            titleName: actress.titleName,
            image: actress.img,
            actress
        });
    })

    // [GET] /JavStar/Actress/Search?query&?page
    app.get("/JavStar/Actress/Search", async(req, res) => {
        let query = req.query.query;
        let data = []
        if(!query){
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
        // skip actress
        data = data.filter((actress, index) => index >= skip);
        // limit actress on page
        data = data.filter((actress, index) => index < (perPage));
        res.render('actress', {
            numberOfActress,
            data,
            alphabet,
            current : page,
            pages: totalPages,
            char:""
        });
    })

    // [GET] /JavStar/Actress || /JavStar/Actress/?char&?page
    app.get("/JavStar/Actress", async (req, res) => {
        let page = req.query.page || 1;
        let perPage = 12;

        let char = '';
        let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

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
            current : page,
            pages: totalPages,
            char
        });
    })

    // [GET] /JavStar
    app.get("/JavStar", async (req, res) => {
        let data = await crawlData.crawlAllJavStar('Y');
        if (!data) {
            res.json({ Message: "Something Wrong!" })
            return;
        }

        let result = data.slice(0, 8);
        res.render("home", { result });
    })

    // [GET] /
    app.get("/" ,(req, res) =>{
        res.redirect("/JavStar");
    })

}

module.exports = Router