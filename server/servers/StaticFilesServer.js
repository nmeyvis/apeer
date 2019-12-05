const express = require("express");

module.exports = function(serverFactory, CLIENT_DIST) {
    let app = express();
    app.use("/static", express.static(CLIENT_DIST));

    return serverFactory.createServer(app);
};