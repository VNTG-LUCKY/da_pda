import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE = path.join(__dirname, 'assets', 'pda_launcher_icon.png');
const ANDROID_RES = path.join(__dirname, 'client', 'android', 'app', 'src', 'main', 'res');

const sizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi':192,
};

const foregroundSizes = {
  'mipmap-mdpi':    108,
  'mipmap-hdpi':    162,
  'mipmap-xhdpi':   216,
  'mipmap-xxhdpi':  324,
  'mipmap-xxxhdpi': 432,
};

async function main() {
  const meta = await sharp(SOURCE).metadata();
  console.log(`Source image: ${meta.width}x${meta.height}`);

  const squareSize = Math.min(meta.width, meta.height);
  const left = Math.round((meta.width - squareSize) / 2);
  const top = Math.round((meta.height - squareSize) / 2);

  const squareBuffer = await sharp(SOURCE)
    .extract({ left, top, width: squareSize, height: squareSize })
    .toBuffer();

  console.log(`Cropped to square: ${squareSize}x${squareSize}`);

  for (const [folder, size] of Object.entries(sizes)) {
    const outPath = path.join(ANDROID_RES, folder, 'ic_launcher.png');
    await sharp(squareBuffer).resize(size, size).png().toFile(outPath);
    console.log(`  -> ${folder}/ic_launcher.png (${size}x${size})`);

    const roundPath = path.join(ANDROID_RES, folder, 'ic_launcher_round.png');
    await sharp(squareBuffer).resize(size, size).png().toFile(roundPath);
    console.log(`  -> ${folder}/ic_launcher_round.png (${size}x${size})`);
  }

  for (const [folder, size] of Object.entries(foregroundSizes)) {
    const fgPath = path.join(ANDROID_RES, folder, 'ic_launcher_foreground.png');
    await sharp(squareBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 27, g: 42, b: 74, alpha: 1 } })
      .png()
      .toFile(fgPath);
    console.log(`  -> ${folder}/ic_launcher_foreground.png (${size}x${size})`);
  }

  console.log('\nDone! All icons updated.');
}

main().catch(console.error);
