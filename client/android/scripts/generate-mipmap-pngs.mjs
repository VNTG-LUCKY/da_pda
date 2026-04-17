/**
 * 런처 아이콘 — 레거시(API 25 이하)용 mipmap PNG 생성
 * 전경: scripts/assets/calculator.svg (ic_launcher_foreground.xml 과 동일 실루엣)
 *
 * 실행 (작업 디렉터리: client):
 *   node android/scripts/generate-mipmap-pngs.mjs
 *   npm run android:icons
 */
import { mkdir, readFile, readdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANDROID_RES = path.join(__dirname, '..', 'app', 'src', 'main', 'res');
const CALCULATOR_SVG = path.join(__dirname, 'assets', 'calculator.svg');

const BG_HEX = '#1E4A6E';

const LEGACY_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

/** PNG와 같은 리소스 이름의 .webp가 있으면 mergeDebugResources Duplicate resources 오류가 납니다. */
async function removeLauncherWebpDuplicates() {
  const entries = await readdir(ANDROID_RES, { withFileTypes: true });
  const stale = ['ic_launcher.webp', 'ic_launcher_round.webp'];
  for (const ent of entries) {
    if (!ent.isDirectory() || !ent.name.startsWith('mipmap-')) continue;
    const dir = path.join(ANDROID_RES, ent.name);
    for (const name of stale) {
      const fp = path.join(dir, name);
      try {
        await unlink(fp);
        console.log(`removed ${ent.name}/${name}`);
      } catch (e) {
        if (e && e.code !== 'ENOENT') throw e;
      }
    }
  }
}

async function buildLauncherPngBuffer(px) {
  const raw = await readFile(CALCULATOR_SVG, 'utf8');
  const dMatch = raw.match(/<path[^>]*\sd="([^"]+)"/);
  if (!dMatch) {
    throw new Error(`No <path d="..."> in ${CALCULATOR_SVG}`);
  }
  const d = dMatch[1];
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="108" height="108" viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg">
  <rect width="108" height="108" fill="${BG_HEX}"/>
  <g transform="translate(54,54) scale(2.5) translate(-12,-12)">
    <path d="${d}" fill="#ffffff"/>
  </g>
</svg>`;
  return sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
}

async function main() {
  await removeLauncherWebpDuplicates();
  for (const [folder, px] of Object.entries(LEGACY_SIZES)) {
    const dir = path.join(ANDROID_RES, folder);
    await mkdir(dir, { recursive: true });
    const buf = await buildLauncherPngBuffer(px);
    await writeFile(path.join(dir, 'ic_launcher.png'), buf);
    await writeFile(path.join(dir, 'ic_launcher_round.png'), buf);
    console.log(`wrote ${folder} (${px}x${px})`);
  }
  console.log('Done. Next (from client folder): npm run build  then  npx cap sync android  then build APK in Android Studio.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
