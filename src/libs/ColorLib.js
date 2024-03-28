export function averageHexColor(colorA, colorB) {
    let rgbColorA = hexToRgb(colorA);
    let rgbColorB = hexToRgb(colorB);

    let avgR = Math.floor((rgbColorA.r + rgbColorB.r) / 2);
    let avgG = Math.floor((rgbColorA.g + rgbColorB.g) / 2);
    let avgB = Math.floor((rgbColorA.b + rgbColorB.b) / 2);

    let avgHex = rgbToHex(avgR, avgG, avgB);

    return avgHex;
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

function rgbToHex(r, g, b) {
    let hexR = r.toString(16).padStart(2, '0');
    let hexG = g.toString(16).padStart(2, '0');
    let hexB = b.toString(16).padStart(2, '0');

    return '#' + hexR + hexG + hexB;
}