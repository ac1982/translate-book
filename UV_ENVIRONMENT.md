# UV environment

This repository uses `uv` as the Python runtime for document processing, but it
is not currently a locked uv project: there is no `pyproject.toml` or `uv.lock`
in this root.

The `.venv-translate/` directory is a local uv-created virtual environment
(`pyvenv.cfg` records `uv = 0.11.2`). It is cache/build output, not source data,
and can be deleted when disk space is needed. Recreate it with `uv` when a
workflow needs Python packages again.
