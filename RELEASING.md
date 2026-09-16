# Releasing Static Noise

1. Update `palette.json` and run `npm run build`.
2. Commit the source and generated `dist/` artifacts together.
3. Create and push a matching tag, for example `v0.0.1`.

Each tag workflow compares its consumer artifact with the preceding tag before dispatching the tag, version, and immutable commit SHA. VS Code is notified only when `dist/vscode/static-noise-color-theme.json` changes; Neovim is notified only when `dist/neovim/palette.lua` changes. Configure the PAT secret `STATIC_NOISE_SYNC_TOKEN` in this repository with access to both consumer repositories and permission to dispatch repository events.

## Bootstrap

The initial `v0.0.1` tag is a bootstrap release: it dispatches the canonical artifact to both consumers, which retain their own `0.0.1` version while recording the immutable SHA. Merge and tag those consumer bootstrap PRs as `v0.0.1`. Later Static Noise releases increment each consumer's PATCH version.
