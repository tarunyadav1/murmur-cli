#!/usr/bin/env node
"use strict";
// Thin launcher for the signed Murmur CLI that ships inside Murmur.app.
// All speech generation happens in the app on this Mac; this script only finds the helper and runs it.
const { spawn } = require("node:child_process");
const { existsSync, realpathSync } = require("node:fs");
const { homedir } = require("node:os");
const { join } = require("node:path");

const HELPER = "Murmur.app/Contents/Helpers/murmur";
// Murmur > Settings > Automation links ~/.local/bin/murmur to the helper in whichever Murmur.app
// installed it. Follow that link first so this launcher and the app's own `murmur` always run the
// same binary, even when the app is outside /Applications.
function appLinkedHelper() {
  try {
    const target = realpathSync(join(homedir(), ".local/bin/murmur"));
    return target.endsWith("/Contents/Helpers/murmur") ? target : undefined;
  } catch {
    return undefined;
  }
}

const candidates = [
  process.env.MURMUR_HELPER,
  appLinkedHelper(),
  join("/Applications", HELPER),
  join(homedir(), "Applications", HELPER),
].filter(Boolean);

if (process.platform !== "darwin") {
  console.error("murmur-cli needs macOS. The Murmur CLI ships with the Mac app: https://www.murmurtts.com/");
  process.exit(1);
}

const helper = candidates.find((p) => existsSync(p));
if (!helper) {
  console.error(
    [
      "Murmur.app was not found in /Applications, ~/Applications or via ~/.local/bin/murmur.",
      "",
      "murmur-cli runs the CLI that ships inside the free Murmur app. Install the app first:",
      "  https://www.murmurtts.com/download/latest",
      "",
      "Then enable access once in Murmur > Settings > Automation.",
      "If the app lives somewhere else, set MURMUR_HELPER to the full path of Contents/Helpers/murmur.",
    ].join("\n"),
  );
  process.exit(1);
}

const child = spawn(helper, process.argv.slice(2), { stdio: "inherit" });
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => child.kill(sig));
child.on("error", (err) => {
  console.error(`Could not start ${helper}: ${err.message}`);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
