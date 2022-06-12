const express = require('express');
const webconfig = require('./webconfig');
const router = require('./routers/index')
const path = require('path');
const app = express();

const PORT = 8000;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

router(app)

app.listen(PORT, () => {
    console.log("Server Run Susscessful!");
})