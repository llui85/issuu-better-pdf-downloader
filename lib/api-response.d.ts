export type Manifest = {
        isPaywallPreview: boolean;
        originalPublishDate: string; // YYYY-MM-DD
        pages: {
                height: number;
                width: number;
                imageUri: string;
                layersInfo?: {
                        uri: string;
                        version: number;
                };
                isPagePaywalled: boolean;
        }[];
        publicationId: string;
        revisionId: string;
        smartzoomUri: string;
        textInfo: {
                size: number;
                uri: string;
                version: string;
        };
};

export type Metadata = {
        access: string;
        contentRating: {
                isReviewed: boolean;
                isSafe: boolean;
                isAdsafe: boolean;
                isExplicit: boolean;
        };
        description: string;
        downloadable: boolean;
        gated: boolean;
        isDocumentLiked: boolean;
        likesCount: number;
        ownerType: "user" | "team";
        publisherProfileUrl: string;
        title: string;
        userDisplayName: string;
};

export type Links = Record<
        number,
        ({
                id: string;
                x: number;
                y: number;
                width: number;
                height: number;
                page: { pageNumber: number };
        } & (
                | {
                          type: "gotoPage";
                          gotoPageNumber: number;
                  }
                | ({
                          type: "openUrl";
                          url: string;
                  } & (
                          | {
                                    urlType: "url";
                            }
                          | {
                                    urlType: "email";
                            }
                          | {
                                    urlType: "video";
                                    videoId: string;
                                    videoService: "youtube" | "vimeo";
                            }
                  ))
        ))[]
>;
