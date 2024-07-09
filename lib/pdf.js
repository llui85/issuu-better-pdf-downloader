import { decodeColor } from "./color.js";
import PDFDocument from "pdfkit";
import { v4 as uuid } from "uuid";

export function createDocument() {
        return new PDFDocument({
                compress: false,
                margins: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                },
                autoFirstPage: false,
        });
}

/**
 * @param {import("pdfkit")} doc
 * @param {import("./proto/layers.d.ts").Page} page
 * @param {import('./api-response.d.ts').Links[keyof import('./api-response.d.ts').Links]} links
 */
export function renderPageToPDF(doc, page, links) {
        doc.addPage({
                size: [page.width, page.height],
        });

        const fonts = page.font.map((font) => {
                const id = uuid();
                doc.registerFont(id, font.resource);
                return id;
        });

        for (const layer of page.layer) {
                if ("rect" in layer && layer.hasOwnProperty("rect")) {
                        if (layer.rect.blend) {
                                console.warn(
                                        "warning: blend mode encountered - will not be rendered in the exported document"
                                );
                        }

                        const color = decodeColor(layer.rect.color);
                        const rectBox = layer.rect.box; // x, y, width, height

                        doc.rect(...rectBox).fill(color.rgb);
                } else if ("text" in layer && layer.hasOwnProperty("text")) {
                        let color = decodeColor(layer.text.color);

                        [...layer.text.text].forEach((char, i) => {
                                const scale = layer.text.scale[i];
                                const originx = layer.text.originx[i];
                                const originy = layer.text.originy[i];

                                doc.save();

                                doc.fontSize(layer.text.size);
                                doc.transform(
                                        ...[
                                                layer.text.matrix[0] * scale,
                                                layer.text.matrix[1] * scale,
                                                layer.text.matrix[2],
                                                layer.text.matrix[3],
                                                layer.text.matrix[4],
                                                layer.text.matrix[5],
                                        ]
                                );

                                doc.font(fonts[layer.text.font]);
                                doc.fillColor(color.rgb);
                                doc.opacity(color.alpha);
                                doc.text(char, originx / scale, originy, {
                                        baseline: "alphabetic",
                                });

                                doc.restore();
                        });
                } else if ("image" in layer && layer.hasOwnProperty("image")) {
                        let index = layer.image.image;
                        let image = page.image[index];

                        doc.image(image.resource, 0, 0, {
                                width: image.width,
                                height: image.height,
                        });
                } else if ("line" in layer && layer.hasOwnProperty("line")) {
                        throw new Error(
                                "error: line layer type not implemented"
                        );
                }
        }

        // TODO: render links
        for (const link of links) {
                console.warn(
                        "warning: link encountered - will not be rendered in the exported document"
                );
        }
}
