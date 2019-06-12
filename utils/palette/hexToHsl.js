function rgbToHsl(rgba) {
  // make sure rgb are contained in a set of [0, 255]
  const red = rgba[0] / 255;
  const green = rgba[1] / 255;
  const blue = rgba[2] / 255;
  const alpha = rgba[3];

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    // achromatic
    if (alpha !== undefined) {
      return [0, 0, lightness, alpha];
    } else {
      return [0, 0, lightness];
    }
  }

  let hue;
  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    case blue:
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue *= 60;
  if (alpha !== undefined) {
    return [hue, saturation, lightness, alpha];
  }
  return [hue, saturation, lightness];
}

const parseHexToDecimal = (h) => parseInt(h, 16);

const hexRegex = /^#[a-fA-F0-9]{6}$/;
const hexaRegex = /^#[a-fA-F0-9]{8}$/;
const reducedHexRegex = /^#[a-fA-F0-9]{3}$/;
const reducedHexaRegex = /^#[a-fA-F0-9]{4}$/;

function hexToRgb(hex) {
  if (hex.match(hexRegex)) {
    return [
      parseHexToDecimal(hex.substr(1, 2)),
      parseHexToDecimal(hex.substr(3, 2)),
      parseHexToDecimal(hex.substr(5, 2))
    ];
  }

  if (hex.match(hexaRegex)) {
    const alpha = parseFloat((parseInt(hex.substr(7, 2), 16) / 255).toFixed(2));

    return [
      parseHexToDecimal(hex.substr(1, 2)),
      parseHexToDecimal(hex.substr(3, 2)),
      parseHexToDecimal(hex.substr(5, 2)),
      alpha
    ];
  }

  if (hex.match(reducedHexRegex)) {
    return hex
      .slice(1)
      .split('')
      .map((x) => parseHexToDecimal(x.repeat(2)));
  }

  if (hex.match(reducedHexaRegex)) {
    const alpha = parseFloat(
      (parseInt(hex.slice(-1).repeat(2), 16) / 255).toFixed(2)
    );

    return [
      ...hex
        .slice(1, -1)
        .split('')
        .map((x) => parseHexToDecimal(x.repeat(2))),
      alpha
    ];
  }

  throw new Error();
}

export default function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}
