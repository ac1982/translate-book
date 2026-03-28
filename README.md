# translate-book

An agent skill that translates entire books and long documents using the agent's built-in intelligence. No external translation API needed — the agent itself is the translator. Works with Claude Code, Codex, Gemini CLI, GitHub Copilot, and other AI coding agents.

## Supported Formats

| Format | Input | Output |
|--------|-------|--------|
| EPUB | `.epub` | `.epub` |
| DOCX | `.docx` | `.docx` |
| PDF (text-based) | `.pdf` | `.md` or `.docx` |
| Markdown | `.md` | `.md` |

## Install

```bash
npx skills add ac1982/translate-book
```

## Usage

In Claude Code, run:

```
/translate-book
```

The skill interactively asks you:

1. **Which file?** — scans your current directory for supported files
2. **Target language?** — any language the agent speaks
3. **Translation style?** — e.g. literary (信达雅), conversational, academic, literal, children's book…

Then it translates the entire book using parallel agents for speed, preserving all formatting, images, fonts, and structure.

## How It Works

- Extracts the document structure (EPUB/DOCX are ZIP archives internally)
- Splits content into ~6 balanced batches by text volume
- Launches parallel background agents, each translating its batch
- Preserves all markup, styles, images, fonts, and metadata
- Updates language codes, titles, and table of contents
- Repackages into the original format

A typical 300-page book translates in a single session.

## Example

```
$ claude
> /translate-book

Found files: elon.epub,erta.docx

Which file? elon.epub
Target language? 简体中文
Translation style? 信达雅

Translating... 6 parallel agents working on 122 chapters
✓ elon-zh.epub created (2.3 MB, 122 chapters translated)
```

## Requirements

- Any AI coding agent that supports skills (Claude Code, Codex, Gemini CLI, GitHub Copilot, etc.)
- `uv` (Python package manager) — used as runtime for file processing
- No external API keys or translation services needed

## License

MIT
