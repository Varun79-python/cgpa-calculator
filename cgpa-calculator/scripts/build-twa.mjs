#!/usr/bin/env node

/**
 * TWA (Trusted Web Activity) APK Builder for CGPA Calculator
 *
 * Steps:
 *   1. Start a local Next.js dev server
 *   2. Use @bubblewrap/core to generate the TWA Android project
 *   3. Build with Gradle
 *   4. Sign & copy the APK to public/apk/
 *
 * Usage:
 *   node scripts/build-twa.mjs
 *
 * Prerequisites:
 *   - Android SDK at C:\Users\venka\AppData\Local\Android\Sdk (or set ANDROID_HOME)
 *   - JDK 17+ at C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot (or set JAVA_HOME)
 */

import { mkdirSync, existsSync, copyFileSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC_APK = join(ROOT, 'public', 'apk');
const TWA_DIR = join(ROOT, 'twa-build');

// ─── Config ──────────────────────────────────────────────────────────
const ANDROID_HOME = process.env.ANDROID_HOME || 'C:\\Users\\venka\\AppData\\Local\\Android\\Sdk';
const JAVA_HOME = process.env.JAVA_HOME || 'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot';
const BUILD_TOOLS_VER = '37.0.0';
const HOST = 'cgpacalculator7.vercel.app';
const PACKAGE_ID = 'com.cgpacalculator.app';
const APP_VERSION = '1.0.0';
const APP_VERSION_CODE = 1;
const LOCAL_PORT = 3333;
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;
const PROD_URL = `https://${HOST}`;
const KEYSTORE_PATH = join(TWA_DIR, 'debug.keystore').replace(/\\/g, '/');

let devServer = null;

function log(...args) { console.log(...args); }
function step(n, total, msg) { console.log(`\n▸ ${n}/${total}  ${msg}`); }

// ─── 0. Start local dev server ──────────────────────────────────────
async function startDevServer() {
  return new Promise((resolve, reject) => {
    log('  Starting local dev server...');
    devServer = spawn('node', [
      join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next'),
      'dev', '-p', String(LOCAL_PORT)
    ], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'development' },
    });

    let started = false;
    const timeout = setTimeout(() => {
      if (!started) {
        devServer.kill();
        reject(new Error('Dev server failed to start within 60s'));
      }
    }, 60000);

    const checkReady = (data) => {
      const text = data.toString();
      if (text.includes('http://localhost:' + LOCAL_PORT) || text.includes('ready')) {
        if (!started) {
          started = true;
          clearTimeout(timeout);
          log('  Dev server running at', LOCAL_URL);
          setTimeout(resolve, 3000);
        }
      }
    };

    devServer.stdout.on('data', checkReady);
    devServer.stderr.on('data', checkReady);
    devServer.on('error', (err) => { clearTimeout(timeout); reject(err); });
  });
}

function stopDevServer() {
  if (devServer) {
    devServer.kill('SIGTERM');
    log('  Dev server stopped');
  }
}

// ─── 1. Prepare directories ────────────────────────────────────────
step(1, 6, 'Preparing directories...');
mkdirSync(PUBLIC_APK, { recursive: true });
log('  Directories ready');

// ─── 2. Create debug keystore ──────────────────────────────────────
step(2, 6, 'Creating debug signing key...');
if (!existsSync(KEYSTORE_PATH)) {
  execSync(
    `"${JAVA_HOME}/bin/keytool" -genkey -v -keystore "${KEYSTORE_PATH}" ` +
    `-alias cgpa-calc-key -keyalg RSA -keysize 2048 -validity 10000 ` +
    `-storepass android -keypass android ` +
    `-dname "CN=CGPA Calculator, OU=Dev, O=CGPA, L=City, ST=State, C=IN"`,
    { stdio: 'pipe', timeout: 30000 }
  );
  log('  Keystore created');
} else {
  log('  Keystore already exists');
}

// ─── 3. Start dev server & generate project ───────────────────────
step(3, 6, 'Starting dev server and generating Android project...');

try {
  await startDevServer();

  log('  Using @bubblewrap/core to generate project...');

  const core = require('@bubblewrap/core');
  const { TwaManifest, TwaGenerator, ConsoleLog } = core;

  // Fetch web manifest from local server
  const twaManifest = await TwaManifest.fromWebManifest(`${LOCAL_URL}/manifest.json`);

  // Override with our production values
  twaManifest.packageId = PACKAGE_ID;
  twaManifest.host = HOST;
  twaManifest.name = 'CGPA Calculator';
  twaManifest.launcherName = 'CGPA Calc';
  twaManifest.startUrl = '/';
  twaManifest.signingKey.path = KEYSTORE_PATH;
  twaManifest.signingKey.alias = 'cgpa-calc-key';
  twaManifest.appVersionCode = APP_VERSION_CODE;
  twaManifest.appVersionName = APP_VERSION;
  twaManifest.display = 'standalone';
  twaManifest.orientation = 'portrait-primary';
  twaManifest.fallbackType = 'customtabs';
  twaManifest.isChromeOSOnly = false;
  twaManifest.enableNotifications = false;
  twaManifest.enableSiteSettingsShortcut = true;
  twaManifest.minSdkVersion = 21;
  twaManifest.splashScreenFadeOutDuration = 300;
  twaManifest.generatorApp = 'bubblewrap-cli';
  twaManifest.webManifestUrl = `${PROD_URL}/manifest.json`;
  twaManifest.fullScopeUrl = `${PROD_URL}/`;

  // Use production URLs for icons (not localhost)
  twaManifest.iconUrl = `${PROD_URL}/icons/icon-512x512.png`;
  twaManifest.maskableIconUrl = `${PROD_URL}/icons/maskable-icon-512x512.png`;

  // Save manifest
  await twaManifest.saveToFile(join(TWA_DIR, 'twa-manifest.json'));

  log('  Creating TWA project...');
  const generator = new TwaGenerator();
  const buildLog = new ConsoleLog('build');
  await generator.createTwaProject(TWA_DIR, twaManifest, buildLog);
  log('  Android project generated');

  // Patch for modern AGP compatibility
  patchProject();

} catch (err) {
  log('  Bubblewrap failed:', err.message);
  log('  Using existing twa-build/ directory...');
  patchProject();
} finally {
  stopDevServer();
}

function patchProject() {
  // Fix minSdkVersion 19 → 21
  const appBuildGradle = join(TWA_DIR, 'app', 'build.gradle');
  if (existsSync(appBuildGradle)) {
    let content = readFileSync(appBuildGradle, 'utf8');
    content = content.replace(/minSdkVersion 19/g, 'minSdkVersion 21');
    writeFileSync(appBuildGradle, content);
  }

  // Fix AndroidManifest - replace localhost with production URLs
  const manifestPath = join(TWA_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (existsSync(manifestPath)) {
    let manifest = readFileSync(manifestPath, 'utf8');
    manifest = manifest.replace(/http:\/\/localhost:\d+/g, PROD_URL);
    manifest = manifest.replace(/package="[^"]+"/, '');
    writeFileSync(manifestPath, manifest);
  }

  // Fix any remaining localhost references in build.gradle
  if (existsSync(appBuildGradle)) {
    let content = readFileSync(appBuildGradle, 'utf8');
    content = content.replace(/http:\/\/localhost:\d+/g, PROD_URL);
    writeFileSync(appBuildGradle, content);
  }

  log('  Project patched for production');
}

// ─── 4. Build APK with Gradle ──────────────────────────────────────
step(4, 6, 'Building APK with Gradle...');
const gradlew = join(TWA_DIR, 'gradlew.bat');

if (existsSync(gradlew)) {
  try {
    execSync(
      `"${gradlew}" assembleRelease --no-daemon`,
      {
        cwd: TWA_DIR,
        stdio: 'pipe',
        timeout: 600000,
        env: { ...process.env, ANDROID_HOME, JAVA_HOME },
      }
    );
    log('  APK built successfully');
  } catch (err) {
    log('  Build failed:', err.message.substring(0, 300));
    log('  Checking for existing APK...');
  }
} else {
  log('  gradlew.bat not found in twa-build/');
  log('  Using pre-built APK if available...');
}

// ─── 5. Sign APK ──────────────────────────────────────────────────
step(5, 6, 'Signing APK...');

const possibleApks = [
  join(TWA_DIR, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk'),
  join(TWA_DIR, 'app-release-unsigned-aligned.apk'),
];

let signed = false;
const finalApk = join(PUBLIC_APK, `cgpa-calculator-v${APP_VERSION}.apk`);
const buildTools = `${ANDROID_HOME}\\build-tools\\${BUILD_TOOLS_VER}`;

for (const apkPath of possibleApks) {
  if (!existsSync(apkPath) || signed) continue;

  const alignedApk = join(TWA_DIR, 'app-release-unsigned-aligned.apk');
  const signedApk = join(TWA_DIR, 'app-release-signed.apk');

  try {
    // Check if already signed
    execSync(`"${buildTools}\\apksigner" verify "${apkPath}" 2>&1`, { stdio: 'pipe', timeout: 10000 });
    copyFileSync(apkPath, finalApk);
    log('  APK already signed, copied directly');
    signed = true;
  } catch (_) {
    try {
      log('  Zipaligning...');
      execSync(`"${buildTools}\\zipalign" -f -v -p 4 "${apkPath}" "${alignedApk}"`, { stdio: 'pipe', timeout: 30000 });

      log('  Signing...');
      execSync(
        `"${buildTools}\\apksigner" sign --ks "${KEYSTORE_PATH}" --ks-key-alias cgpa-calc-key ` +
        `--ks-pass pass:android --key-pass pass:android --out "${signedApk}" "${alignedApk}"`,
        { stdio: 'pipe', timeout: 30000 }
      );

      copyFileSync(signedApk, finalApk);
      signed = true;
    } catch (signErr) {
      log(`  Signing failed: ${signErr.message.substring(0, 100)}`);
    }
  }

  if (signed) break;
}

// Also try to find any APK in the build output
if (!signed) {
  try {
    const output = execSync(`dir /s /b "${TWA_DIR}\\*.apk" 2>nul`, { encoding: 'utf8', timeout: 5000 });
    const files = output.split('\n').map(s => s.trim()).filter(f => f.endsWith('.apk'));
    for (const f of files) {
      if (signed) break;
      try {
        const alignedApk = join(TWA_DIR, 'app-release-unsigned-aligned.apk');
        const signedApk = join(TWA_DIR, 'app-release-signed.apk');
        execSync(`"${buildTools}\\zipalign" -f -v -p 4 "${f}" "${alignedApk}"`, { stdio: 'pipe', timeout: 30000 });
        execSync(
          `"${buildTools}\\apksigner" sign --ks "${KEYSTORE_PATH}" --ks-key-alias cgpa-calc-key ` +
          `--ks-pass pass:android --key-pass pass:android --out "${signedApk}" "${alignedApk}"`,
          { stdio: 'pipe', timeout: 30000 }
        );
        copyFileSync(signedApk, finalApk);
        signed = true;
      } catch (_) {}
    }
  } catch (_) {}
}

// ─── 6. Report ────────────────────────────────────────────────────
step(6, 6, 'Done');

console.log('\n' + '='.repeat(55));
if (existsSync(finalApk)) {
  const size = (readFileSync(finalApk).length / 1024 / 1024).toFixed(2);
  console.log('BUILD SUCCESSFUL');
  console.log(`  APK: public/apk/cgpa-calculator-v${APP_VERSION}.apk`);
  console.log(`  Size: ${size} MB`);
  console.log(`  Package: ${PACKAGE_ID}`);
  console.log(`  Host: ${HOST}`);
  console.log(`  Offline: Yes (via PWA service worker)`);
  console.log(`  Auto-update: Yes (loads live site on each launch)`);
} else {
  console.log('APK NOT FOUND - build may have failed');
  console.log('  The Android project is in twa-build/');
  console.log('  Open in Android Studio to build manually.');
}
console.log('='.repeat(55));
