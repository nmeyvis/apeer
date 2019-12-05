module.exports = {
    removeChildren(id) {
        let myNode = document.getElementById(id);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }
};