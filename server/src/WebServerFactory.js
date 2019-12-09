const http = require("http");
const https = require("https");


module.exports = class {

    constructor(config) {
        this.config = config;
        this.ssl = { key: this.config.key, cert: this.config.cert }
    }

    createServer(app) {
        console.log(`Creating server... Is Secure: ${this.config.secure}`);

        if(this.config.secure) {
            return https.createServer(this.ssl, app);
        } else {
            return http.createServer(app);
        }
    }
};