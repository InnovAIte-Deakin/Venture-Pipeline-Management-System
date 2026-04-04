#!/usr/bin/env node

/**
 * Detects the current OS and CPU architecture and installs
 * the matching lightningcss native binary package.
 *
 * Supported packages (mirrors the lightningcss npm registry):
 *   lightningcss-darwin-arm64       macOS Apple Silicon
 *   lightningcss-darwin-x64         macOS Intel
 *   lightningcss-linux-arm64-gnu    Linux ARM64 (glibc)
 *   lightningcss-linux-arm-gnueabihf Linux ARMv7
 *   lightningcss-linux-x64-gnu      Linux x64 (glibc)
 *   lightningcss-linux-x64-musl     Linux x64 (musl / Alpine)
 *   lightningcss-win32-arm64-msvc   Windows ARM64
 *   lightningcss-win32-x64-msvc     Windows x64
 */

const { execSync } = require("child_process");
const os = require("os");

const VERSION = "^1.30.1";

function getPlatformPackage() {
  const platform = process.platform; // 'darwin' | 'linux' | 'win32'
  const arch = process.arch;         // 'x64' | 'arm64' | 'arm'

  if (platform === "darwin") {
    if (arch === "arm64") return `lightningcss-darwin-arm64@${VERSION}`;
    if (arch === "x64")   return `lightningcss-darwin-x64@${VERSION}`;
  }

  if (platform === "linux") {
    // Detect musl (Alpine) vs glibc
    let isMusl = false;
    try {
      const lddOut = execSync("ldd --version 2>&1").toString();
      isMusl = lddOut.toLowerCase().includes("musl");
    } catch {
      // ldd not available or errored — assume glibc
    }

    if (arch === "arm64")  return `lightningcss-linux-arm64-gnu@${VERSION}`;
    if (arch === "arm")    return `lightningcss-linux-arm-gnueabihf@${VERSION}`;
    if (arch === "x64") {
      return isMusl
      ? `lightningcss-linux-x64-musl@${VERSION}`
      : `lightningcss-linux-x64-gnu@${VERSION}`;
    }
  }

  if (platform === "win32") {
    if (arch === "arm64") return `lightningcss-win32-arm64-msvc@${VERSION}`;
    if (arch === "x64")   return `lightningcss-win32-x64-msvc@${VERSION}`;
  }

  return null;
}

const pkg = getPlatformPackage();

if (!pkg) {
  console.warn(
    `[install-lightningcss] Unsupported platform: ${process.platform}/${process.arch} — skipping.`
  );
  process.exit(0);
}

console.log(`[install-lightningcss] Installing ${pkg} for ${process.platform}/${process.arch}…`);

try {
  // Detect package manager
  let installCmd;
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    installCmd = `pnpm add -D ${pkg} --ignore-scripts`;
  } catch {
    try {
      execSync("yarn --version", { stdio: "ignore" });
      installCmd = `yarn add -D ${pkg} --ignore-scripts`;
    } catch {
      installCmd = `npm install --save-dev ${pkg} --ignore-scripts`;
    }
  }

  execSync(installCmd, { stdio: "inherit" });
  console.log(`[install-lightningcss] Done.`);
} catch (err) {
  console.error(`[install-lightningcss] Installation failed:`, err.message);
  process.exit(1);
}
