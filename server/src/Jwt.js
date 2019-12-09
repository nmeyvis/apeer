const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.jwt_private_key;

module.exports = {
    sign(object) {
        return jwt.sign(object, PRIVATE_KEY);
    },

    verify(token) {
        return jwt.verify(token, PRIVATE_KEY);
    }
};