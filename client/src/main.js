import "./static/styles.css";
import "./static/buttons.css";

const Vue = require("vue").default;
const Room = require("./types/Room.js");
const PreviewManager = require("./types/PreviewManager.js");


window.previewManager = new PreviewManager();
/*window.downloads = new Downloads();

window.myPeer = {
    nickname: "peer" + Numbers.getRandomMaxInt(100),
    offeredFiles: [],
    downloads: downloads.files,
    isLocal: true
};

window.client = new WebTorrent({
    dht: false
});

window.network = { rooms: [] };*/


window.isMobile = function() {
    return screen.availWidth < 768;
};

const App = require("./app.vue");

document.title = BRANDING.appName;

new Vue({
    el: '#container',
    render: h => h(App.default)
});

window.debug = function() {
    let debug = !(localStorage.getItem("debug") == "true");
    localStorage.setItem("debug", debug);
    return `is debugging: ${ debug }`;
};