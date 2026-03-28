---
name: translate-book
description: Translate a book or long document (epub, docx, pdf, markdown) to another language using the agent's built-in intelligence. Interactive — asks user for file, language, and style.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent
---

# Translate Book

Use the agent's built-in intelligence (like Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot) to translate an entire book or long document. No external translation API — you ARE the translator. Supports epub, docx, pdf (text-based), and markdown.

## Interaction Language

Detect the user's language from their message and use it as the primary TUI response language throughout the entire workflow. For example, if the user writes in Chinese, all prompts, status updates, and results should be in Chinese.

## Interactive Setup

Ask the user 3 questions before starting (glob for supported files in cwd to offer choices):

1. Which file? (scan for `*.epub`, `*.docx`, `*.pdf`, `*.md`)
2. Target language?
3. Translation style? (e.g. 信达雅、口语化、学术、直译、儿童读物…)

## Workflow

### 1. Unpack
Most book formats are ZIP archives internally (epub, docx). Use `uv` + Python `zipfile` to extract to `work/`. For markdown, read directly. For PDF, extract text via PyMuPDF (warn and stop if scanned/image-only).

### 2. Translate content — only text, preserve everything else
Analyze structure, split content files into **~6 balanced batches**, launch **parallel background agents**.

Each agent only translates human-readable text. Everything else stays untouched:

| Translate | Preserve as-is |
|-----------|---------------|
| Paragraphs, headings, TOC entries | Markup structure (HTML, XML, markdown syntax) |
| Chapter titles, section names | Tags, attributes, CSS classes, IDs, links |
| Body text, dialogue, quotes | Images (`*.jpg`, `*.png`, `*.svg`, ...) |
| Metadata: book title, description | Fonts (`*.ttf`, `*.otf`, `*.woff`, ...) |
| | Stylesheets (`*.css`, `styles.xml`, ...) |
| | Config files (`mimetype`, `container.xml`, `[Content_Types].xml`, `_rels/*`, ...) |
| | Footnote citations, URLs, ISBN, copyright notices |

Format-specific notes:
- **EPUB**: content is in `OEBPS/*.xhtml`; also translate `nav.xhtml` TOC and `toc.ncx`; update `content.opf` language code
- **DOCX**: text lives in `<w:t>` elements within `word/document.xml`, `word/header*.xml`, `word/footer*.xml`; update `docProps/core.xml`
- **PDF**: lossy — export to markdown first, translate, output as `.md` or `.docx` (inform user)
- **Markdown**: preserve all syntax (links, images, code blocks, front matter)

### 3. Repack
Rebuild in the original format. Output as `<name>-<lang>.<ext>`.
- EPUB special rule: `mimetype` must be first ZIP entry, uncompressed (`ZIP_STORED`)

### 4. Validate & cleanup
Structure check, spot-check 2-3 chapters, clean up `work/`
