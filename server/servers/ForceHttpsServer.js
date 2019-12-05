const express = require("express");
const http = require("http");

module.exports = function() {
    let app = express();

    app.use(function(req, res, next) {
        res.redirect('https://' + req.headers.host + req.url);
    });

    return http.createServer(app);
};