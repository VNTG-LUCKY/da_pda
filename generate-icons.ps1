# PDA 앱 아이콘 생성 스크립트 (PowerShell - .NET 내장 기능 사용)
# 실행: powershell -ExecutionPolicy Bypass -File generate-icons.ps1

Add-Type -AssemblyName System.Drawing

# 원본 이미지 경로
$SOURCE = "C:\Users\HDPARK\.cursor\projects\c-Users-HDPARK-Desktop-da-pda\assets\pda_icon_source.png"

# Android res 폴더
$RES_BASE = "C:\Users\HDPARK\Desktop\da_pda\client\android\app\src\main\res"

# 해상도 정의
$SIZES = @(
    @{ Folder = "mipmap-mdpi";    Size = 48  },
    @{ Folder = "mipmap-hdpi";    Size = 72  },
    @{ Folder = "mipmap-xhdpi";   Size = 96  },
    @{ Folder = "mipmap-xxhdpi";  Size = 144 },
    @{ Folder = "mipmap-xxxhdpi"; Size = 192 }
)

Write-Host "아이콘 생성 시작..." -ForegroundColor Cyan

# 원본 이미지 로드
$srcBitmap = [System.Drawing.Bitmap]::new($SOURCE)
Write-Host "원본 이미지 로드 완료: $($srcBitmap.Width)x$($srcBitmap.Height)" -ForegroundColor Green

foreach ($entry in $SIZES) {
    $size = $entry.Size
    $folder = $entry.Folder
    $destDir = Join-Path $RES_BASE $folder

    # 리사이즈
    $destBitmap = [System.Drawing.Bitmap]::new($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($destBitmap)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($srcBitmap, 0, 0, $size, $size)
    $g.Dispose()

    # 저장
    $destBitmap.Save((Join-Path $destDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Save((Join-Path $destDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Save((Join-Path $destDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Dispose()

    Write-Host "  [완료] $folder ($($size)x$($size))" -ForegroundColor Yellow
}

$srcBitmap.Dispose()

Write-Host "`n모든 아이콘 생성 완료!" -ForegroundColor Green
Write-Host "Android Studio에서 APK를 다시 빌드하면 새 아이콘이 적용됩니다." -ForegroundColor Cyan
