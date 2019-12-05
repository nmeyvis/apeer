class PreviewManager {

    constructor() {
        this.file = null
    }

    open(file) {
        console.log("previewing file...");
        this.file = null; // this is here otherwise vue watchers wont trigger if the file is the same as open arg
        this.file = file;
    }
}

module.exports = PreviewManager;