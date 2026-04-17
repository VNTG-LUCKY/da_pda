/**
 * PDA 앱 아이콘 생성 스크립트
 * 원본 이미지를 각 Android mipmap 해상도에 맞게 리사이즈합니다.
 * 
 * 실행방법: node generate-icons.mjs
 */

import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 원본 아이콘 경로 (생성된 이미지)
const SOURCE_IMAGE = 'C:\\Users\\HDPARK\\.cursor\\projects\\c-Users-HDPARK-Desktop-da-pda\\assets\\pda_icon_source.png';

// Android mipmap 해상도 정의
const SIZES = [
  { folder: 'mipmap-mdpi',    size: 48  },
  { folder: 'mipmap-hdpi',    size: 72  },
  { folder: 'mipmap-xhdpi',   size: 96  },
  { folder: 'mipmap-xxhdpi',  size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

const ANDROID_RES = join(__dirname, 'client', 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('아이콘 생성 시작...');
  
  const img = await loadImage(SOURCE_IMAGE);
  console.log(`원본 이미지 로드 완료: ${img.width}x${img.height}`);

  for (const { folder, size } of SIZES) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    
    const buffer = canvas.toBuffer('image/png');
    
    const destDir = join(ANDROID_RES, folder);
    
    // ic_launcher.png
    const launcherPath = join(destDir, 'ic_launcher.png');
    writeFileSync(launcherPath, buffer);
    
    // ic_launcher_round.png (동일 이미지 사용)
    const roundPath = join(destDir, 'ic_launcher_round.png');
    writeFileSync(roundPath, buffer);
    
    // ic_launcher_foreground.png (동일 이미지 사용)
    const fgPath = join(destDir, 'ic_launcher_foreground.png');
    writeFileSync(fgPath, buffer);
    
    console.log(`✓ ${folder} (${size}x${size}) 완료`);
  }
  
  console.log('\n모든 아이콘 생성 완료!');
  console.log('APK를 다시 빌드하면 새 아이콘이 적용됩니다.');
}

generateIcons().catch(console.error);
