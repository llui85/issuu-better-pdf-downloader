import path, { dirname } from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const layers = await protobuf.load(path.resolve(__dirname, "./layers.proto"));
const text = await protobuf.load(path.resolve(__dirname, "./text.proto"));

const Page = layers.lookupType("layers.Page");
const Document = text.lookupType("text.Document");

/**
 * @param {Buffer} data
 */
export function decodePage(data) {
        return /** @type {import('./layers.d.ts').Page} */ (
                /** @type {unknown} */ (Page.decode(data))
        );
}

/**
 * @param {Buffer} data
 */
export function decodeTextInfo(data) {
        return /** @type {import('./text.d.ts').Document} */ (
                /** @type {unknown} */ (Document.decode(data))
        );
}
