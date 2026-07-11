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
const HOST = 'cgpa-calculator.vercel.app';
const PACKAGE_ID = 'com.cgpacalculator.app';
const APP_VERSION = '1.0.0';
const APP_VERSION_CODE = 1;
const LOCAL_PORT = 3333;
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;
const KEYSTORE_PATH = join(TWA_DIR, 'debug.keystore').replace(/\\/g, '/');
const BUBBLEWRAP_CLI = join('C:\\nvm4w\\nodejs\\node_modules\\@bubblewrap\\cli\\bin\\bubblewrap.js');

let devServer = null;

function log(...args) { console.log(...args); }
function step(n, msg) { console.log(`\n▸ ${n}/6 ${msg}`); }

// ─── 0. Start local dev server ──────────────────────────────────────
async function startDevServer() {
  return new Promise((resolve, reject) => {
    log('▸ 0/6  Starting local dev server...');
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

    devServer.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.includes('http://localhost:' + LOCAL_PORT) || text.includes('ready')) {
        started = true;
        clearTimeout(timeout);
        log('  ✓ Dev server running at', LOCAL_URL);
        setTimeout(resolve, 3000); // Give it 3 more seconds to stabilize
      }
    });

    devServer.stderr.on('data', (data) => {
      // Next outputs to stderr sometimes
      const text = data.toString();
      if (text.includes('http://localhost:' + LOCAL_PORT) || text.includes('ready')) {
        started = true;
        clearTimeout(timeout);
        log('  ✓ Dev server running at', LOCAL_URL);
        setTimeout(resolve, 3000);
      }
    });

    devServer.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function stopDevServer() {
  if (devServer) {
    devServer.kill('SIGTERM');
    log('  ✓ Dev server stopped');
  }
}

// ─── 1. Prepare directories ────────────────────────────────────────
step(1, 'Preparing directories...');
mkdirSync(PUBLIC_APK, { recursive: true });
if (existsSync(TWA_DIR)) {
  rmSync(TWA_DIR, { recursive: true, force: true });
}
mkdirSync(TWA_DIR, { recursive: true });
log('  ✓ Directories ready');

// ─── 2. Create debug keystore ──────────────────────────────────────
step(2, 'Creating debug signing key...');
if (!existsSync(KEYSTORE_PATH)) {
  execSync(
    `"${JAVA_HOME}/bin/keytool" -genkey -v -keystore "${KEYSTORE_PATH}" ` +
    `-alias cgpa-calc-key -keyalg RSA -keysize 2048 -validity 10000 ` +
    `-storepass android -keypass android ` +
    `-dname "CN=CGPA Calculator, OU=Dev, O=CGPA, L=City, ST=State, C=IN"`,
    { stdio: 'pipe', timeout: 30000 }
  );
  log('  ✓ Keystore created');
} else {
  log('  ✓ Keystore already exists');
}

// ─── 3. Start dev server & generate project ───────────────────────
step(3, 'Starting dev server and generating Android project...');

try {
  await startDevServer();

  // Use bubblewrap CLI to init the project from the local server
  log('  → Running bubblewrap init...');
  
  // The CLI is interactive, so we need to pipe answers
  // Bubblewrap prompts order (from confirmTwaConfig):
  // 1. host (press enter for default)
  // 2. startUrl (press enter for default)
  // 3. app name (press enter for default)
  // 4. launcher name (press enter for default)
  // 5. display mode (choose standalone which is index 1)
  // 6. theme color (press enter for default)
  // 7. navigation color (press enter for default)
  // 8. orientation (choose portrait-primary which is index 0)
  // 9. shortcuts (yes)
  // 10. monochrome icon url (press enter for none)
  // 11. play billing (no)
  // 12. location delegation (no)
  // 13. keystore path (press enter for default)
  // 14. key alias (press enter for default)
  // 15. confirm directory creation (yes)
  // 16. create signing key (yes)
  // 17-22. key details (full name, org unit, org, country, password, key password)
  
  // We already created the keystore, so we need to provide the path
  // Let's use a different approach - create the twa-manifest.json and use fromFile
  
  // Actually, let's try using the core API directly with local URLs
  const core = require('@bubblewrap/core');
  const { TwaManifest, TwaGenerator, ConsoleLog } = core;
  
  // Fetch the web manifest from our local server
  const twaManifest = await TwaManifest.fromWebManifest(`${LOCAL_URL}/manifest.json`);
  
  // Override with our values
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
  twaManifest.minSdkVersion = 19;
  twaManifest.splashScreenFadeOutDuration = 300;
  twaManifest.generatorApp = 'bubblewrap-cli';
  twaManifest.webManifestUrl = `${LOCAL_URL}/manifest.json`;
  
  // The icon URLs should point to our local server since the dev server is running
  twaManifest.iconUrl = `${LOCAL_URL}/icons/icon-512x512.png`;
  twaManifest.maskableIconUrl = `${LOCAL_URL}/icons/maskable-icon-512x512.png`;
  
  // Save and generate
  await twaManifest.saveToFile(join(TWA_DIR, 'twa-manifest.json'));
  
  log('  → Creating project from manifest...');
  const generator = new TwaGenerator();
  const buildLog = new ConsoleLog('build');
  await generator.createTwaProject(TWA_DIR, twaManifest, buildLog);
  log('  ✓ Android project generated');

  // Patch generated project for compatibility with modern AGP
  // Fix 1: minSdkVersion 19 → 21 (required by androidbrowserhelper)
  const appBuildGradle = join(TWA_DIR, 'app', 'build.gradle');
  if (existsSync(appBuildGradle)) {
    let gradleContent = readFileSync(appBuildGradle, 'utf8');
    gradleContent = gradleContent.replace(/minSdkVersion 19/g, 'minSdkVersion 21');
    writeFileSync(appBuildGradle, gradleContent);
    log('  ✓ Patched minSdkVersion → 21');
  }

  // Fix 2: Remove package attr from AndroidManifest.xml (namespace in build.gradle)
  const manifestPath = join(TWA_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');
  if (existsSync(manifestPath)) {
    let manifestContent = readFileSync(manifestPath, 'utf8');
    manifestContent = manifestContent.replace(/\n    package="[^"]+"/, '');
    writeFileSync(manifestPath, manifestContent);
    log('  ✓ Patched AndroidManifest.xml (removed package attr)');
  }

} catch (err) {
  log('  ✗ Failed:', err.message);
  log('  → Falling back to manual template approach...');
  
  // If the core API failed, use the manual approach
  await createProjectManually();
} finally {
  stopDevServer();
}

// ─── 4. Build APK with Gradle ──────────────────────────────────────
step(4, 'Building APK with Gradle (this may take a few minutes)...');
const gradlew = join(TWA_DIR, 'gradlew.bat');

if (existsSync(gradlew)) {
  try {
    execSync(
      `set ANDROID_HOME=${ANDROID_HOME} && set JAVA_HOME=${JAVA_HOME} && "${gradlew}" assembleRelease --no-daemon`,
      {
        cwd: TWA_DIR,
        stdio: 'pipe',
        timeout: 600000,
        env: { ...process.env, ANDROID_HOME, JAVA_HOME },
      }
    );
    log('  ✓ APK built successfully');
  } catch (err) {
    log('  ✗ Build failed:', err.message.substring(0, 200));
    log('  → Checking for existing APK files...');
  }
} else {
  log('  ✗ Gradle wrapper not found');
  process.exit(1);
}

// ─── 5. Sign APK ──────────────────────────────────────────────────
step(5, 'Signing APK...');

const possibleApks = [join(TWA_DIR, 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk')];
try {
  const output = execSync(`dir /s /b "${TWA_DIR}\\*.apk" 2>nul`, { encoding: 'utf8', timeout: 5000 });
  output.split('\n').map(s => s.trim()).filter(Boolean).forEach(f => possibleApks.push(f));
} catch (_) {}

let signed = false;
for (const apkPath of possibleApks) {
  if (existsSync(apkPath) && !signed) {
    const alignedApk = join(TWA_DIR, 'app-release-unsigned-aligned.apk');
    const signedApk = join(TWA_DIR, 'app-release-signed.apk');
    const finalApk = join(PUBLIC_APK, `cgpa-calculator-v${APP_VERSION}.apk`);
    const buildTools = `${ANDROID_HOME}\\build-tools\\${BUILD_TOOLS_VER}`;

    try {
      // Check if already signed
      execSync(`"${buildTools}\\apksigner" verify "${apkPath}" 2>&1`, { stdio: 'pipe', timeout: 10000 });
      copyFileSync(apkPath, finalApk);
      log('  ✓ APK already signed, copied directly');
      signed = true;
    } catch (_) {
      // Sign it
      try {
        log(`  → Zipaligning: ${apkPath}`);
        execSync(`"${buildTools}\\zipalign" -f -v -p 4 "${apkPath}" "${alignedApk}"`, { stdio: 'pipe', timeout: 30000 });
        
        log('  → Signing...');
        execSync(
          `"${buildTools}\\apksigner" sign --ks "${KEYSTORE_PATH}" --ks-key-alias cgpa-calc-key ` +
          `--ks-pass pass:android --key-pass pass:android --out "${signedApk}" "${alignedApk}"`,
          { stdio: 'pipe', timeout: 30000 }
        );
        
        copyFileSync(signedApk, finalApk);
        signed = true;
      } catch (signErr) {
        log(`  ✗ Signing failed: ${signErr.message.substring(0, 80)}`);
      }
    }

    if (signed) {
      const size = (readFileSync(finalApk).length / 1024 / 1024).toFixed(2);
      log(`  ✓ Signed APK: public/apk/cgpa-calculator-v${APP_VERSION}.apk (${size} MB)`);
    }
  }
}

// ─── 6. Cleanup ────────────────────────────────────────────────────
step(6, 'Cleaning up...');
// We keep the twa-build directory for debugging but output the APK
log('  ✓ Done');

// ─── Final report ──────────────────────────────────────────────────
console.log('\n' + '='.repeat(55));
if (existsSync(join(PUBLIC_APK, `cgpa-calculator-v${APP_VERSION}.apk`))) {
  console.log('✅ BUILT SUCCESSFULLY');
  console.log(`   📱 public/apk/cgpa-calculator-v${APP_VERSION}.apk`);
  console.log(`   📐 Size: ${(readFileSync(join(PUBLIC_APK, `cgpa-calculator-v${APP_VERSION}.apk`)).length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   📋 Package: ${PACKAGE_ID}`);
} else {
  console.log('⚠️  APK NOT FOUND');
  console.log('   The Gradle project has been generated in twa-build/');
  console.log('   You can open it in Android Studio and build manually.');
}
console.log('='.repeat(55));

// ─── Manual fallback ──────────────────────────────────────────────
async function createProjectManually() {
  const templateDir = join(dirname(require.resolve('@bubblewrap/core/package.json')), 'template_project');
  if (!existsSync(templateDir)) throw new Error('Template not found');

  execSync(`xcopy /E /I /Y "${templateDir}" "${TWA_DIR}"`, { stdio: 'pipe', timeout: 10000 });

  // Clean template .gradle cache
  const gradleCache = join(TWA_DIR, '.gradle');
  if (existsSync(gradleCache)) rmSync(gradleCache, { recursive: true, force: true });

  // Completely rewrite build.gradle with hardcoded values (no template vars)
  const appBuildGradle = join(TWA_DIR, 'app', 'build.gradle');
  writeFileSync(appBuildGradle, getBuildGradleContent());

  // Fix AndroidManifest
  const manifestPath = join(TWA_DIR, 'app', 'src', 'main', 'AndroidManifest.xml');
  let manifest = readFileSync(manifestPath, 'utf8');
  manifest = manifest
    .replace(/package="<%= packageId %>"/g, `package="${PACKAGE_ID}"`)
    .replace(/<%= host %>/g, HOST);
  writeFileSync(manifestPath, manifest);

  // Fix strings.xml
  const stringsPath = join(TWA_DIR, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
  let strings = readFileSync(stringsPath, 'utf8');
  strings = strings.replace(/https:\/\/<%= host %>/g, `https://${HOST}`);
  writeFileSync(stringsPath, strings);

  // Fix colors.xml - remove template variables
  const colorsPath = join(TWA_DIR, 'app', 'src', 'main', 'res', 'values', 'colors.xml');
  if (existsSync(colorsPath)) {
    let colors = readFileSync(colorsPath, 'utf8');
    colors = colors.replace(/<%=.*?%>/g, '');
    writeFileSync(colorsPath, colors);
  }

  log('  ✓ Project manually created from template');
}

// ─── Hardcoded build.gradle content ────────────────────────────────
function getBuildGradleContent() {
  return `plugins {
    id 'com.android.application'
}

android {
    namespace '${PACKAGE_ID}'
    compileSdkVersion 36
    
    defaultConfig {
        applicationId '${PACKAGE_ID}'
        minSdkVersion 19
        targetSdkVersion 35
        versionCode ${APP_VERSION_CODE}
        versionName '${APP_VERSION}'
        
        resValue "string", "appName", "CGPA Calculator"
        resValue "string", "launcherName", "CGPA Calc"
        resValue "string", "launchUrl", "https://${HOST}/"
        resValue "string", "hostName", "${HOST}"
        resValue "color", "colorPrimary", "#6366F1"
        resValue "color", "navigationColor", "#FAFAFA"
        resValue "color", "backgroundColor", "#FAFAFA"
        resValue "string", "providerAuthority", "${PACKAGE_ID}.fileprovider"
        resValue "bool", "enableNotification", "false"
        resValue "integer", "splashScreenFadeOutDuration", "300"
        resValue "string", "generatorApp", "bubblewrap-cli"
        resValue "string", "fallbackType", "customtabs"
        resValue "bool", "enableSiteSettingsShortcut", "true"
        resValue "string", "orientation", "portrait-primary"
        resValue "string", "webManifestUrl", "https://${HOST}/manifest.json"
    }
    
    buildTypes {
        release {
            minifyEnabled false
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    lintOptions {
        checkReleaseBuilds false
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.1'
}
`;
}
