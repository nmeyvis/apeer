const FileAltStatus = require("./FileAltStatus.js");
const Images = require("../utils/Images.js");
const FileTypes = require("../utils/FileTypes.js");

const iconPaths = require.context("../static/file-types/svg/");

class MyFile {
    constructor(options) {
        this.updateListeners = [];

        this.name = options.name;
        this.size = options.size;
        this.extension = options.extension;
        this.fullName = this.name + "." + this.extension;
        this.lastModified = options.lastModified;
        this.w3cFile =  options.w3cFile;

        this.magnetURI = options.magnetURI;

        this.originLocal = options.originLocal;

        this.isDownloading = false;
        this.isDownloaded = false;
        this.downloadProgress = "0.00";

        this.shouldWait = (typeof options.shouldWait === "boolean") ? options.shouldWait : false; // status indicating that an async task is running and the file's state will be majorly updated soon. all actions on this file should wait.
        this.alternativeStatus = (options.alternativeStatus) ? options.alternativeStatus : FileAltStatus.wait; // used in conjunction with wait to give a more detailed status about why waiting. can be set to anything

        this.downloadSpeed = 0;
        this.uploadSpeed = 0;

        this.thumbnail = options.thumbnail || null;
        this.mimeType = options.mimeType || null;

        this.generateThumbnail();
    }

    static fromW3CFile(file) {
        let parts = file.name.split(".");
        let extension = parts[parts.length - 1];

        parts.splice(parts.length - 1, 1); // we don't want the extension in the file name

        let name = parts.join();

        return new MyFile({
            name,
            size: file.size,
            extension,
            lastModified: file.lastModified,
            w3cFile: file,
            mimeType: file.type
        });
    }

    resetDownload() {
        this.isDownloaded = false;
        this.isDownloading = false;
        this.downloadSpeed = 0;
        this.downloadProgress = 0;
    }

    generateThumbnail() {
        if(this.isImage()) {
            if(this.thumbnail || this.w3cFile == null) {
                return;
            }

            this.url().then(url => {
                Images.rescale(url, this.w3cFile.type, 60, (url) => this.thumbnail = url);
            });
        }
    }

    get safeFileName() {
        const MAX_LENGTH = 24;
        let name = this.name;
        if(name.length > MAX_LENGTH) {
           name = name.substring(0, MAX_LENGTH);
           name += "..";
        }

        name += ("." + this.extension);
        return name;
    }

    getIconPath() {
        if(this.thumbnail) {
            return this.thumbnail;
        }


        let filename;
        try {
            filename = iconPaths(`./${ this.extension }.svg`);
        } catch(err) {
            filename = iconPaths("./file.svg");
        }

        console.log(filename);
        return `/${filename}`;
    }

    isUploading() {
        return this.uploadSpeed != 0;
    }

    static prettyBytes(bytes) {
        if(bytes < 1000) {
            return Math.trunc(bytes) + " bytes";
        }

        if(bytes < (1000 * 1000)) {
            return Math.trunc(bytes / 1000) + " KB";
        }

        return (bytes / 1000 / 1000).toFixed(2) + " MB";
    }

    prettySize() {
        return MyFile.prettyBytes(this.size);
    }

    hasTorrent() {
        return this._torrent != null;
    }

    set torrent(torrent) {
        this._torrent = torrent;
        this.magnetURI = torrent.magnetURI;

        torrent.on("done", () => {
            this.isDownloaded = true;
            this.isDownloading = false;

            this.downloadSpeed = 0;
        });

        torrent.on("download", () => {
            this.isDownloading = true;
            this.downloadProgress = (torrent.progress * 100).toFixed(2);
            this.downloadSpeed = MyFile.prettyBytes(torrent.downloadSpeed);
        });

        torrent.on("upload", () => {
            this.uploadSpeed = MyFile.prettyBytes(torrent.uploadSpeed);
        });
    }

    wait(status = FileAltStatus.wait) {
        this.shouldWait = true;
        this.alternativeStatus = status;
    }

    release() {
        this.shouldWait = false;
        this.alternativeStatus = null;
    }

    set downloadProgress(downloadProgress) {
        this._downloadProgress = downloadProgress;
        this._update("downloadProgress");
    }

    get downloadProgress() {
        return this._downloadProgress;
    }

    set shouldWait(shouldWait) {
        this._shouldWait = shouldWait;
        this._update("shouldWait");
    }

    get shouldWait() {
        return this._shouldWait;
    }

    get alternativeStatusResolved() {
        return (this.originLocal) ? this.alternativeStatus.local : this.alternativeStatus.remote;
    }

    get torrent() {
        return this._torrent;
    }

    get torrentFile() {
        if(this.torrent == null) {
            return null;
        }

        return this.torrent.files[0];
    }

    saveToDevice() {
        if(this.isDownloaded) {
            let torrentFile = this.torrent.files[0];

            torrentFile.getBlob((err, blob) => {
                console.log(blob.type);
                save(blob, torrentFile.name)
            });
        } else {
            alert("file not downloaded!");
        }

        function save(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(blob, filename);
            else { // Others
                var a = document.createElement("a"),
                    url = URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }
    }

    isImage() {
        return this.mimeType != null && this.mimeType.split("/")[0] === "image";
    }

    /**
     * Should only serialize properties that other peers should know about.
     * @returns {{name: *, size: *, extension: (*|string), lastModified: (*|number|string)}}
     */
    toJSON() {
        let safeObject = {
            name: this.name,
            size: this.size,
            extension: this.extension,
            lastModified: this.lastModified,
            shouldWait: this.shouldWait,
            alternativeStatus: this.alternativeStatus,
            thumbnail: this.thumbnail,
            mimeType: this.mimeType,
            magnetURI: this.magnetURI
        };

        if(this.hasTorrent()) {
            safeObject.magnetURI = this.torrent.magnetURI;
        }

        // console.log("serializing for transport: " + JSON.stringify(safeObject));
        return safeObject;
    }

    addOriginLocalUpdateListener(listenForProps, callback) {
        console.log("isOriginLocal: " + this.originLocal);
        if(this.originLocal) {
            this.addUpdateListener(listenForProps, callback);
        }
    }

    addUpdateListener(listenForProps, callback) {
        if(!Array.isArray(listenForProps)) {
            throw "addUpdateListener arg1 must be an array";
        }

        callback._listenForProps = listenForProps;
        this.updateListeners.push(callback);
        return this;
    }

    url() {
        return new Promise((resolve, reject) => {
            if(this.hasTorrent()) {
                this.torrentFile.getBlobURL((err, url) => { resolve(url) });
                return;
            }

            if(this.w3cFile != null) {
                resolve(URL.createObjectURL(this.w3cFile));
                return;
            }

            reject("cannot create a URL with the file's current state");
        });
    }

    isEmbeddable() {
        return (this.originLocal || this.isDownloaded)
            && (["text", "image", "audio", "video"].includes(this.mimeTypeRoot)
                || ["application/pdf"].includes(this.mimeType));

    }

    get mimeTypeRoot() {
        if(this.mimeType == null) {
            return null;
        }

        return this.mimeType.split("/")[0];
    }

    _update(propName) {
        console.log("notifying prop update on file: " + propName);
        this.updateListeners.forEach(callback => {
            if(callback._listenForProps.includes(propName)) {
                callback(propName, this[propName], this);
            }
        });
    }

    /**
     * Checks whether the passed file is 'equal' to this one
     * We call it weak because it's technically possible for two files with completely different contents to pass this equals
     * This is because it only compares the file's meta data and not the actual content - this is good enough for some situations
     * @param file the file to compare
     * @returns {boolean} true if the passed file is equal, false otherwise
     */
    weakEquals(file) {
        return !(file.name !== this.name
            || file.extension !== this.extension
            || file.size !== this.size
            || file.lastModified !== this.lastModified);
    }
}

module.exports = MyFile;