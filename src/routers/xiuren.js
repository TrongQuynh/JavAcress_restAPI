const express = require('express');
const router = express.Router();

// Controller
const xiurenController = require("../controller/xiuren-controller");
//[GET] /Heaven/Xiuren
router.get("/top/:top",xiurenController.getTopAlbum);
router.get("/tag/:tagname/page/:page",xiurenController.getXiurenPage);
router.get("/tag/:tagname",xiurenController.getXiurenPage);
router.get("/:album/:page",xiurenController.getDetailAlbum);
router.get("/:album",xiurenController.getDetailAlbum);


module.exports = router;