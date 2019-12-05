
module.exports = {
    isImage(type) {
        return mimeRoot(type) === "image"
    }
};

function mimeRoot(mine) {
    return mime.split("/")[0];
}