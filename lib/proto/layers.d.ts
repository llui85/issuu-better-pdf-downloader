export type Image = {
        resource: Buffer;
        width: number;
        height: number;
};

export type Font = {
        resource: Buffer;
        weight: number;
};

export type TextLayer = {
        text: string;
        font: number;
        size: number;
        color: number;
        matrix: number[];
        originx: number[];
        originy: number[];
        scale: number[];
};

export type LineLayer = {
        color: number;
        blend: number;
        coord: number[];
};

export type RectLayer = {
        color: number;
        blend: number;
        box: [number, number, number, number]; // x, y, width, height
};

export type ImageLayer = {
        image: number;
        width: number;
        height: number;
};

export type Layer =
        | {
                  image: ImageLayer;
          }
        | {
                  text: TextLayer;
          }
        | {
                  rect: RectLayer;
          }
        | {
                  line: LineLayer;
          };

export type Page = {
        query: number;
        version: number;
        build: string;
        width: number;
        height: number;
        usable: boolean;
        rmse: number;
        fallback: string;
        layer: Layer[];
        font: Font[];
        image: Image[];
};
