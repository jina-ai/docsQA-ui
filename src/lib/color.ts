/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/*
 *    Color conversion from
 *    https://github.com/Qix-/color-convert
 */

export function numericRgbToHsl(rgb?: [number, number, number]): [number, number, number] | undefined {
    if (!rgb) {
        return undefined;
    }
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h: number = 0;
    let s: number = 0;

    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    const l = (min + max) / 2;

    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
}

export function parseRgbHex(rgbHex: string | number): [number, number, number] | undefined {
    const match = rgbHex.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
        return undefined;
    }

    let colorString = match[0];

    if (match[0].length === 3) {
        colorString = colorString.split('').map((char) => {
            return char + char;
        }).join('');
    }

    const integer = parseInt(colorString, 16);
    const r = (integer >> 16) & 0xFF;
    const g = (integer >> 8) & 0xFF;
    const b = integer & 0xFF;

    return [r, g, b];
}

export function rgbHexToHslVec(rgbHex: string) {
    return numericRgbToHsl(parseRgbHex(rgbHex));
}

export function hslVecToCss(hslVec: [number, number, number], alpha?: number) {

    if (alpha) {
        return `hsla(${Math.round(hslVec[0])}, ${Math.round(hslVec[1])}%, ${Math.round(hslVec[2])}%, ${alpha.toFixed(2)})`;
    }

    return `hsl(${Math.round(hslVec[0])}, ${Math.round(hslVec[1])}%, ${Math.round(hslVec[2])}%)`;
}

function hex(x: string) {
    return (`0${parseInt(x, 10).toString(16)}`).slice(-2);
}

export function rgbCssToHex(rgb: string) {
    const matched = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    if (!matched) {
        return undefined;
    }

    if (matched[4] === '0') {
        return `#fff`;
    }

    return `#${hex(matched[1])}${hex(matched[2])}${hex(matched[3])}`;
}

export function hslCssToVec(hsl: string): [number, number, number] | undefined {
    const matched = hsl.match(/^hsla?\((\d+)%?,\s*(\d+)%?,\s*(\d+)%?(?:,\s*(\d+))?\)$/);
    if (!matched) {
        return undefined;
    }

    return [parseInt(matched[1], 10), parseInt(matched[2], 10), parseInt(matched[3], 10)];
}

export function parseCssToHsl(this: Element, input: string): [number, number, number] | undefined {
    let text = input;
    if (input.startsWith('--')) {
        text = window.getComputedStyle(this || document.body).getPropertyValue(input);
    }

    if (text.startsWith('#')) {
        return rgbHexToHslVec(text);
    }

    const tryRgb = rgbCssToHex(text);
    if (tryRgb) {
        return rgbHexToHslVec(tryRgb);
    }

    const tryHsl = hslCssToVec(text);
    if (tryHsl) {
        return tryHsl;
    }

    return undefined;
}
