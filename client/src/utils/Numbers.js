module.exports = {
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomMaxInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
};