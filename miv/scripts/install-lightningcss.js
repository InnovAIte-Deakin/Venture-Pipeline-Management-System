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
  // Use the same package manager that launched the lifecycle script. Falling
  // back to "first tool found" mixes package-manager metadata in node_modules.
  const userAgent = process.env.npm_config_user_agent || "";
  let installCmd = `npm install ${pkg} --no-save --ignore-scripts`;

  if (userAgent.startsWith("pnpm/")) {
    installCmd = `pnpm add -D ${pkg} --ignore-scripts`;
  } else if (userAgent.startsWith("yarn/")) {
    installCmd = `yarn add -D ${pkg} --ignore-scripts`;
  }

  execSync(installCmd, { stdio: "inherit" });

  // Some package managers write the platform-specific package
  // into package.json's devDependencies — that's normal for a one-off install, but
  // this script runs on every teammate's machine on every OS. If that write ever gets
  // committed, it hardcodes today's platform the same way the old Linux-only pin did,
  // and the next person on a different OS hits the exact same install failure in reverse.
  // Strip it back out immediately so package.json returns to its committed, platform-neutral
  // state — the binary is still installed in node_modules for this run either way.
  // `npm pkg delete` is used here (not the detected package manager) because it's a plain
  // JSON editor bundled with npm, so it works the same regardless of which tool did the install.
  const pkgName = pkg.split("@")[0];
  try {
    execSync(`npm pkg delete devDependencies.${pkgName}`, { stdio: "inherit" });
  } catch (cleanupErr) {
    console.warn(
      `[install-lightningcss] Could not auto-clean package.json — please manually remove "${pkgName}" from devDependencies before committing.`,
      cleanupErr.message
    );
  }

  console.log(`[install-lightningcss] Done.`);
} catch (err) {
  console.error(`[install-lightningcss] Installation failed:`, err.message);
  process.exit(1);
}
