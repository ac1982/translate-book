---
name: translate-book
description: Translate a book or long document (epub, docx, pdf, markdown) to another language using the agent's built-in intelligence. Interactive — asks user for file, language, and style.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent
---

# Translate Book

Use the agent's built-in intelligence to translate an entire book or long document. No external translation API — you ARE the translator. Supports epub, docx, pdf (text-based), and markdown.

## Interaction Language

Detect the user's language from their message and use it as the primary TUI response language throughout the entire workflow. For example, if the user writes in Chinese, all prompts, status updates, and results should be in Chinese.

## Interactive Setup

Ask the user 3 questions before starting (glob for supported files in cwd to offer choices):

1. Which file? (scan for `*.epub`, `*.docx`, `*.pdf`, `*.md`)
2. Target language?
3. Translation style? (e.g. 信达雅、口语化、学术、直译、儿童读物…)

## Format-Specific Handling

### EPUB
- Extract via Python `zipfile` to `work/`
- Analyze spine order from `content.opf`, count text volume per XHTML file
- Translate XHTML content files in parallel batches (preserve all markup)
- Translate `nav.xhtml` TOC entries and `toc.ncx` `<text>` elements
- Update `content.opf`: `dc:language`, `dc:title`, `dc:description`
- Repackage: `mimetype` first entry, uncompressed (`ZIP_STORED`); all others `ZIP_DEFLATED`
- Output: `<name>-<lang>.epub`

### DOCX
- Extract via Python `zipfile` to `work/` (docx is also a ZIP archive)
- Translate `word/document.xml` and any `word/header*.xml`, `word/footer*.xml` — text lives in `<w:t>` elements
- Preserve all XML structure, styles, formatting runs (`<w:r>`, `<w:rPr>`)
- Update `docProps/core.xml` language and title if present
- Repackage as ZIP, output: `<name>-<lang>.docx`

### PDF (text-based)
- Extract text via `uv add pymupdf` → `fitz` (PyMuPDF), check if text-extractable
- If scanned/image PDF: warn user and stop
- Export to markdown, translate, then rebuild as a new markdown or docx (PDF rebuild is lossy — inform user of format choice)
- Output: `<name>-<lang>.md` or `<name>-<lang>.docx`

### Markdown
- Read the file directly, split into sections by headings
- Translate text, preserve all markdown syntax (links, images, code blocks, front matter)
- Output: `<name>-<lang>.md`

## Workflow (all formats)

### 1. Setup & Analysis
- Use `uv` as Python runtime, install deps as needed
- Extract/read the source, analyze structure and text volume
- Decide batch split based on volume

### 2. Translate content
- Split into **~6 balanced batches**, launch **parallel background agents**
- Each agent: read → translate (preserving structure/markup) → write back
- Pass user's style preference and target language to each agent
- Bibliographic citations/references stay in original language

### 3. Metadata & navigation
- Update language codes, titles, TOC entries as appropriate for the format

### 4. Package & output
- Rebuild in the original format (or best available — see PDF note)
- Preserve all images, fonts, styles unchanged

### 5. Validate & cleanup
- Structure check, spot-check 2-3 translated sections for quality
- Clean up temp files
