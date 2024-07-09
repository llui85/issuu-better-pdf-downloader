const MANIFEST_BASE_API = "https://reader3.isu.pub";
const METADATA_BASE_API = "https://issuu.com/call/reader";

/**
 * @param {string} url
 * @returns {{publicationId: string} | {username: string; id: string;}} */
function getDocumentDetailsFromUrl(url) {
        const slug = new URL(url).pathname;
        const segments = slug.split("/");
        if (slug.startsWith("/docs")) {
                return {
                        publicationId: /** @type string */ (segments.at(-1)),
                };
        }
        return {
                username: /** @type string */ (segments.at(1)),
                id: /** @type string */ (segments.at(-1)),
        };
}

/** @param {ReturnType<typeof getDocumentDetailsFromUrl>} details */
function getManifestURL(details) {
        if ("publicationId" in details) {
                return `${MANIFEST_BASE_API}/d/${details.publicationId}/reader3_4.json`;
        }
        return `${MANIFEST_BASE_API}/${details.username}/${details.id}/reader3_4.json`;
}

/** @param {ReturnType<typeof getDocumentDetailsFromUrl>} details */
function getMetadataURL(details) {
        if ("publicationId" in details) {
                return `${METADATA_BASE_API}/dynamic-v2/${details.publicationId}`;
        }
        return `${METADATA_BASE_API}/dynamic/${details.username}/${details.id}`;
}

/** @param {ReturnType<typeof getDocumentDetailsFromUrl>} details */
function getLinksURL(details) {
        if ("publicationId" in details) {
                return `${METADATA_BASE_API}/links-v2/${details.publicationId}`;
        }
        return `${METADATA_BASE_API}/links/${details.username}/${details.id}`;
}

/** @param {string} documentURL */
export async function getManifest(documentURL) {
        const details = getDocumentDetailsFromUrl(documentURL);
        const url = getManifestURL(details);
        const response = await fetch(url);
        try {
                return /** @type {import('./api-response.d.ts').Manifest} */ (
                        (await response.json()).document
                );
        } catch {
                return null;
        }
}

/** @param {string} documentURL */
export async function getMetadata(documentURL) {
        const details = getDocumentDetailsFromUrl(documentURL);
        const url = getMetadataURL(details);
        const response = await fetch(url);
        const data = await response.json();
        if (data.metadata) {
                return /** @type {import('./api-response.d.ts').Metadata} */ (
                        data.metadata
                );
        }
        return null;
}

/** @param {string} documentURL */
export async function getLinks(documentURL) {
        const details = getDocumentDetailsFromUrl(documentURL);
        const url = getLinksURL(details);
        const response = await fetch(url);
        return /** @type {import('./api-response.d.ts').Links} */ (
                await response.json()
        );
}

/** @param {import('./api-response.d.ts').Manifest['pages'][number]} page */
export async function downloadPage(page) {
        if ("layersInfo" in page && page.layersInfo !== undefined) {
                if (page.layersInfo.version !== 2) {
                        throw new Error(
                                `downloadPage: unsupported layer version encountered (version "2" is supported, but received "${page.layersInfo.version}")`
                        );
                }
                const response = await fetch(`https://${page.layersInfo.uri}`);
                return {
                        height: page.height,
                        width: page.width,
                        type: /** @type {const} */ ("layers"),
                        data: Buffer.from(await response.arrayBuffer()),
                };
        }
        const response = await fetch(`https://${page.imageUri}`);
        return {
                height: page.height,
                width: page.width,
                type: /** @type {const} */ ("image"),
                data: Buffer.from(await response.arrayBuffer()),
        };
}
