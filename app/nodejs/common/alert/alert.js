/**
 * Created by sky on 16/12/1.
 */

require('colors');

module.exports = {
    log: function () {
        console.log.apply(console, arguments);
    },
    info: function (msg) {
        console.log(msg.blue);
    },
    warn: function (msg) {
        console.log(msg.yellow);
    },
    error: function (msg) {
        console.log(msg.red);
    },
    assert: function (condition, msg) {
        console.assert(condition, msg.magenta);
    }
};

