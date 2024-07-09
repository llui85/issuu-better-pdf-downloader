# issuu-better-pdf-downloader

* Inspired by [jakeactually](https://github.com/jakeactually/issuu)'s work
* A POC downloader that creates "true" PDF files, which contain real text and vector graphics
* Implementation of the Protobuf-based `.bin` page format
* Partial reimplementation of PDF rendering - excluding the followng:
        * Links (requires a rework of the dimensions scaling - open a PR if interested in implementing)
        * Blend modes
        * Line layers
        * JPG pages

```
npm install
npm start "https://issuu.com/issuu/docs/issuu_digitaltoolkit"
```
