const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/import", (req, res) => {
    res.send('hello xml file')
});

app.get("/results/:test-id/aggregate", (req, res) => {
    res.send('hello results')
});

app.listen(PORT);