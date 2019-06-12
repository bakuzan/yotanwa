import hexToHsl from './hexToHsl';
import hslToHex from './hslToHex';

function adjustLightness(deg, col) {
  const hsla = hexToHsl(col);
  const l = hsla[2] + deg / 100;
  hsla[2] = Math.max(Math.min(l, 100), 0);
  return hslToHex(hsla);
}

export function lighten(percent, hex) {
  return adjustLightness(percent, hex);
}

export function darken(percent, hex) {
  return adjustLightness(-percent, hex);
}
