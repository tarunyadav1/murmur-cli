# murmur-cli

Command line and MCP access to [Murmur](https://www.murmurtts.com/), an offline text-to-speech and voice cloning app for Mac. Speech is generated on your own computer; your text is never uploaded.

This package is a small launcher. It finds the signed CLI that ships inside Murmur.app and runs it, so you can call `murmur` from any project, npm script or AI agent.

## Requirements

- macOS 15 or later (Apple Silicon or Intel)
- The Murmur app, free to download: https://www.murmurtts.com/download/latest
- Automation turned on once in Murmur > Settings > Automation

## Install

```sh
npm install -g murmur-cli
murmur status
```

Or run it without installing:

```sh
npx murmur-cli status
```

## Generate speech

```sh
murmur generate --text "Welcome back. Today we're building a local voice workflow." \
  --voice af_bella --speed 0.95 --output audio/intro.wav

murmur generate --input scripts/chapter-01.txt --model kokoro --output audio/chapter-01.m4a
```

Other commands:

```sh
murmur models [--json]
murmur models install MODEL_ID
murmur voices [--model ID] [--json]
murmur batch --manifest scenes.json
murmur jobs get JOB_ID
```

Run `murmur --help` for every option.

## Use with AI agents (MCP)

Murmur includes an MCP server, so Claude Code, Codex, Cursor and other MCP clients can generate voiceovers on your Mac.

```sh
claude mcp add --transport stdio --scope user murmur -- npx -y murmur-cli mcp serve
```

```json
{
  "mcpServers": {
    "murmur": { "command": "npx", "args": ["-y", "murmur-cli", "mcp", "serve"] }
  }
}
```

## Custom app location

If Murmur.app is not in `/Applications` or `~/Applications`, point to the helper:

```sh
export MURMUR_HELPER="/path/to/Murmur.app/Contents/Helpers/murmur"
```

## Docs

Full CLI and MCP guide: https://www.murmurtts.com/docs/automation

The launcher in this package is MIT licensed. The Murmur app has its own license, with a free plan and a one-time Pro upgrade.
