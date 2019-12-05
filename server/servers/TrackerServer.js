const Tracker = require('bittorrent-tracker').Server;

module.exports = function() {
    let tracker = new Tracker();

    tracker.on('error', function (err) {
        // fatal server error!
        console.log(err.message)
    });

    tracker.on('warning', function (err) {
        // client sent bad data. probably not a problem, just a buggy client.
        console.log(err.message)
    });

    tracker.on('listening', function () {
        // fired when all requested servers are listening
        console.log('listening on http port:' + tracker.http.address().port)
        console.log('listening on udp port:' + tracker.udp.address().port)
    });

    // listen for individual tracker messages from peers:
    tracker.on('start', function (addr) {
        console.log('got start message from ' + addr)
    });

    return tracker;
};