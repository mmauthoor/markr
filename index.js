const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const xmlparser = require('express-xml-bodyparser');
const Result = require('./models/result.js');

const db = require("./database");


// importing xml file for testing only
// const fs = require('fs');
// const results = fs.readFileSync("sample_results.xml", "utf-8");

// Middleware
app.use(express.json());

// Need to ensure correct content type is screened for. Ideally would catch as error
app.post("/import", xmlparser({explicitArray: false, ignoreAttrs: false, mergeAttrs: true}), (req, res) => {
    // ideally if results are undefined/null, throw error
    let results = req.body["mcq-test-results"];
    if (!results) {
        console.log('oh no, an error')
    } else {
        Result.create(results);
        console.log("results added!");
    }

    res.send("sent to db successfully")
})

app.get("/results/:test-id/aggregate", (req, res) => {
    res.send('hello results')
});

app.listen(PORT);