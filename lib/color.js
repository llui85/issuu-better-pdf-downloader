/**
 * Extracts RGB and alpha values from a color number
 * @example 4293853223 = {rgb: [ 239, 0, 39 ], alpha: 1}
 * @param {number} color
 */
export function decodeColor(color) {
        return {
                rgb: /** @type {[number, number, number]} */ ([
                        (color >> 16) & 255,
                        (color >> 8) & 255,
                        (color >> 0) & 255,
                ]),
                alpha: ((color >> 24) & 255) / 255,
        };
}
