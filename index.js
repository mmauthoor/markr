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
    let results = req.body["mcq-test-results"]["mcq-test-result"];
  
    if (results) {
        console.log(results)
        Result.create(results);
        res.send("sent to db successfully");
    } else {
        // catch error
    }
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