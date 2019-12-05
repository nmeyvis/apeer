const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "oih3ioguheIutirehbgf*&^%dskjfh*&T%sdkufh89267y5rkjsdhfweiuyr(*YUAskdjh[][l/.slkdjnf9er8ygthpiksdfvhrj";

module.exports = {
    sign(object) {
        return jwt.sign(object, PRIVATE_KEY);
    },

    verify(token) {
        return jwt.verify(token, PRIVATE_KEY);
    }
};