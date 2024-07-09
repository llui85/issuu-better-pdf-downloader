export type TextBlock = {
        text: string;
        height: number;
        matrix: number[];
        charOffset: number[];
};

export type Page = {
        pageNumber: number;
        width: number;
        height: number;
        textBlock: TextBlock[];
};

export type Document = {
        page: Page[];
        build: string;
};
