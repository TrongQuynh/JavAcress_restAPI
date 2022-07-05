
// Router
const javIdolRouter = require("../routers/javIdol");
const xiurenRouter = require("../routers/xiuren");

function Router(app) {

    //[GET] /Heaven/Xiuren
    app.use("/Heaven/Xiuren", xiurenRouter);

    // [GET] /Heaven
    app.use("/Heaven",javIdolRouter);

    // [GET] /
    app.get("/" ,(req, res) =>{
        res.redirect("/Heaven");
    })

}

module.exports = Router