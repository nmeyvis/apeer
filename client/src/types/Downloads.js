class Downloads {
    constructor(torrentClient) {
        this.files = [];
        this.torrentClient = torrentClient;

        this.onNewDownloadListeners = [];
    }

    add(file) {
        console.log("downloading file: ", JSON.stringify(file));
        if(this.torrentClient.get(file.magnetURI) != null) {
            alert("you already have that file. check download manager.");
            return;
        }

        this.files.push(file);
        this._notifyNewDownload(file);

        file.wait();
        this.torrentClient.add(file.magnetURI, torrent => {
            file.release();
            file.isDownloading = true;
            file.torrent = torrent;
        });
    }

    downloadsInProgress() {
        return this.files.filter(f => f.isDownloading);
    }

    get length() {
        return this.files.length;
    }

    onNewDownload(callback) {
        this.onNewDownloadListeners.push(callback);
        return this;
    }

    _notifyNewDownload(file) {
        this.onNewDownloadListeners.forEach(callback => callback(file));
    }
}

module.exports = Downloads;