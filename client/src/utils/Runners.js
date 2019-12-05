const Numbers = require("./Numbers.js");

module.exports = {
    chanceExecute: function(run, chance, forceRun = false) {
        if(Numbers.getRandomInt(0, 100) <= chance|| forceRun) {
            run();
        }
    }
};