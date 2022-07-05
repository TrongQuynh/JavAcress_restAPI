const crawlData = require("../data/crawl-xiuren");
const crawlAlbum = require("../data/crawl-xiurenPhoto");

class xiurenController{

    //[GET] /Heaven/Xiuren/Top/:top
    async getTopAlbum(req, res, next){
        let top = req.params.top;
        let data = await crawlData.crawlTopXiuren(top);
        let modelList = data.modelList;
        let pageTitle = data.pageTitle;
        let pageDescript = data.pageDescript;
        let subMenu = data.subMenu;
        let albumJustPorted = data.albumJustPorted;
        res.render("xiuren",{
            totalPage: 1,
            data: modelList,
            currentPage: 1,
            pageTitle,
            pageDescript,
            subMenu,
            top,
            albumJustPorted,
            isGetTop:true
        })
    }

    //[GET] /Heaven/Xiuren/tag/:tagname || /Heaven/Xiuren/tag/:tagname/page/:page
    async getXiurenPage(req,res,next){
        let page = req.params.page || 1;
        let tagname = req.params.tagname || "xiuren";
        let data = await crawlData.crawlModelByTagnameAtPage(page,tagname);

        let totalPage = Number(data.totalPage);
        let modelList = data.modelList;
        let pageTitle = data.pageTitle;
        let pageDescript = data.pageDescript;
        let hotAlbum = data.hotAlbum;
        let subMenu = data.subMenu;

        res.render("xiuren",{
            totalPage,
            data: modelList,
            currentPage: page,
            tagname,
            pageTitle,
            pageDescript,
            subMenu,
            hotAlbum,
            isGetTop:false
        })
    }

    //[GET] /Heaven/Xiuren/:album || /Heaven/Xiuren/:album/:page
    async getDetailAlbum(req,res,next){
        let currentPage = req.params.page || 1;
        let albumName = req.params.album;
        let album = await crawlAlbum.crawlPhotoAtPage(albumName,currentPage);
        let subMenu = album.subMenu;
        if(album != null){
            res.render("xiuren-detail",{
                album,
                currentPage,
                albumName,
                subMenu
            });
        }else{

        }
    }

}

module.exports = new xiurenController();