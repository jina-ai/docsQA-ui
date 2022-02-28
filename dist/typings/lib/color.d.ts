export declare function numericRgbToHsl(rgb?: [number, number, number]): [number, number, number] | undefined;
export declare function parseRgbHex(rgbHex: string | number): [number, number, number] | undefined;
export declare function rgbHexToHslVec(rgbHex: string): [number, number, number] | undefined;
export declare function hslVecToCss(hslVec: [number, number, number], alpha?: number): string;
export declare function rgbCssToHex(rgb: string): string | undefined;
export declare function hslCssToVec(hsl: string): [number, number, number] | undefined;
export declare function parseCssToHsl(this: Element, input: string): [number, number, number] | undefined;
