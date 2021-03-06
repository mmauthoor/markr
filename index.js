const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const xmlparser = require('express-xml-bodyparser');
const Result = require('./models/result.js');

// Middleware
app.use(express.json());
app.use(xmlparser({
    explicitArray: false, 
    ignoreAttrs: false, 
    mergeAttrs: true
}));

app.post("/import", (req, res) => {

    // Need to check this is the correct xml content type as per brief.
    // Need to screen for other kinds of markr xml files (i.e. not results) here.
    let results = req.body["mcq-test-results"]["mcq-test-result"];
    results = results.length > 1 ? results : [results];
    Result.create(results);
    res.send("sent to db successfully");

});

app.get("/results/:testId/aggregate", (req, res) => {
    let testId = req.params.testId;
    Result.find_aggregate_by_testId(testId)
        .then(dbRes => {
            let [aggregate, ..._] = dbRes;
            res.json(aggregate);
        });
});

app.listen(PORT);