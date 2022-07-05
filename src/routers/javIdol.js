const express = require('express');
const router = express.Router();

// Controller
const homeController = require("../controller/home-controller");
const javIdolController = require("../controller/javIdol-Controller");

router.get("/Actress/Detail/:name",javIdolController.showDetailInfoJavIdol);
router.get("/Actress/Search",javIdolController.searchJavIdol);
router.get("/Actress", javIdolController.showJavIdol);

// [GET] /Heaven
router.get("/", homeController.get);

module.exports = router;