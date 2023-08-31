export const svgString2Image = (
    svgString: string,
    callback: (base64: string) => void = () => null,
    fill = '#000',
    width = 512,
    height = 512,
    format = 'png',
) => {
    // SVG data URL from SVG string
    var svgData = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(svgString));
    // create canvas in memory(not in DOM)
    var canvas = document.createElement('canvas');
    // get canvas context for drawing on canvas
    var context = canvas.getContext('2d');
    // set canvas size
    canvas.width = width;
    canvas.height = height;
    // create image in memory(not in DOM)
    var image = new Image();
    // later when image loads run this
    image.onload = () => { // async (happens later)
        context!.rect(0, 0, width, height);
        context!.fillStyle = fill;
        context!.fill();
        // draw image with SVG data to canvas
        context!.drawImage(image, 0, 0, width, height); 
        // snapshot canvas as png
        const pngData = canvas.toDataURL('image/' + format);
        // pass png data URL to callback
        callback(pngData);
    }; // end async
    // start loading SVG data into in memory image
    image.src = svgData;
}

export const b64toBlob = async (b64Data: string) => {
    const base64Response = await fetch(b64Data);
    return await base64Response.blob();
}
