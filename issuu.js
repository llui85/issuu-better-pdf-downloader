import fs from "fs";
import terminalKit from "terminal-kit";
import pLimit from "p-limit";
import { ArgumentParser } from "argparse";

import { downloadPage, getLinks, getManifest, getMetadata } from "./lib/api.js";
import { decodePage } from "./lib/proto/decode.js";
import { createDocument, renderPageToPDF } from "./lib/pdf.js";
import { yesOrNo } from "./lib/ui.js";

const term = terminalKit.terminal;

const parser = new ArgumentParser();
parser.add_argument("url");
const args = parser.parse_args();

if (!args.url.startsWith("https://issuu.com/")) {
        term(
                "warning: invalid url provided (must start with https://issuu.com/)\n"
        );
        process.exit(1);
}

term(`Fetching document details...\n`);
const [manifest, metadata] = await Promise.all([
        getManifest(args.url),
        getMetadata(args.url),
]);

if (!manifest || !metadata) {
        term.error("Error: Document could not be found.\n");
        process.exit(1);
}

term(
        `^+^W^#^k${metadata.title}^ published by ^+^W^#^k${metadata.userDisplayName}^:\n`
);

if (!metadata.downloadable) {
        term(
                `^Y^#^k\nThis document has been marked as non-downloadable by ${metadata.userDisplayName}.^:\n`
        );
        term("Are you sure you want to download this document? [y/N]: ");
        let result = await yesOrNo(term);
        if (!result) {
                process.exit(0);
        }
        term("\n");
}

const limit = pLimit(4);

/**
 * @param {string} id
 * @param {Parameters<typeof downloadPage>[0]} page
 * @param {import("terminal-kit/Terminal.d.ts").ProgressBarController} progress
 */
async function downloadPageWithProgress(id, page, progress) {
        progress.startItem(id);
        const data = await downloadPage(page);
        progress.itemDone(id);
        return data;
}

const downloadProgress = term.progressBar({
        items: manifest.pages.length,
        title: "Downloading pages:",
        eta: true,
        percent: true,
});
const [pages, links] = await Promise.all([
        Promise.all(
                manifest.pages.map((page, index) =>
                        limit(() =>
                                downloadPageWithProgress(
                                        index.toString(),
                                        page,
                                        downloadProgress
                                )
                        )
                )
        ),
        getLinks(args.url),
]);
downloadProgress.stop();
term("\n");

const filename = `${metadata.title.replaceAll(/[^A-Za-z0-9-_ ]/g, "_")}.pdf`;

const doc = createDocument();
doc.pipe(fs.createWriteStream(filename));

for (const pageIndex in pages) {
        const page = pages[pageIndex];
        if (page.type === "layers") {
                const data = decodePage(page.data);
                renderPageToPDF(
                        doc,
                        data,
                        links[parseInt(pageIndex) + 1] ?? []
                );
        } else {
                term("warning: image page found, not supported\n");
        }
}

term("Saving PDF to disk... (this may take a few seconds)\n");
doc.end();

term(`Saved to: ^+^W^#^k${filename}^:\n`);
