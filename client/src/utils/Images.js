module.exports = {
    downscale(dataUrl, newWidth, imageType = "image/jpeg", imageArguments = 0.7) {
        let image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

        // Create a temporary image so that we can compute the height of the downscaled image.
        image = new Image();
        image.src = dataUrl;
        oldWidth = image.width;
        oldHeight = image.height;
        newHeight = Math.floor(oldHeight / oldWidth * newWidth)

        // Create a temporary canvas to draw the downscaled image on.
        canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the downscaled image on the canvas and return the new data URL.
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        newDataUrl = canvas.toDataURL(imageType, imageArguments);
        return newDataUrl;
    },
    rescale: function scaleImage(url, type, newWidth, callback) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        newImage(url, (image) => {
            let newHeight = proportionalHeight(image.width, image.height, newWidth);

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(image, 0, 0, newWidth, newHeight);
            callback(canvas.toDataURL(type));
        });

        function newImage(url, onload) {
            let image = new Image();
            image.onload = () => onload(image);
            image.src = url;
        }

        function proportionalHeight(width, height, newWidth) {
            return Math.floor(height * newWidth / width);
        }
    }
};