/**
 * 프로덕션: 정적 파일(3000) + /api → 백엔드(6000) 리버스 프록시
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = Number(process.env.PORT) || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:6000';
const distPath = path.join(__dirname, 'dist');
const apkPath = path.join(__dirname, 'apk', 'da-pda.apk');
const logPath = path.join(__dirname, 'server-log.txt');

function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
  try { fs.appendFileSync(logPath, line); } catch (e) {}
  console.log(msg);
}

const app = express();

app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  onProxyReq(proxyReq, req) {
    console.log('[Proxy]', req.method, req.url, '->', BACKEND_URL + req.url);
  },
  onError(err, req, res) {
    console.error('[Proxy Error]', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Gateway', message: 'Backend unreachable' }));
  },
}));

// APK 다운로드: /download → client/apk/da-pda.apk
app.get('/download', (req, res) => {
  if (!fs.existsSync(apkPath)) {
    log('APK not found: ' + apkPath);
    res.status(404).send('APK file not found. Copy app-debug.apk to client/apk/da-pda.apk');
    return;
  }
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="da-pda.apk"');
  fs.createReadStream(apkPath).pipe(res);
});

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  log('Frontend: http://0.0.0.0:' + PORT + ' (정상 시작)');
  log('API proxy: /api -> ' + BACKEND_URL);
  log('APK download: /download -> ' + (fs.existsSync(apkPath) ? apkPath : '(파일 없음)'));
  console.log('Frontend: http://0.0.0.0:' + PORT);
  console.log('API proxy: /api -> ' + BACKEND_URL);
  console.log('APK download: http://0.0.0.0:' + PORT + '/download');
});

server.on('error', (err) => {
  const msg = err.code === 'EADDRINUSE'
    ? '3000 포트 사용 중. 기존 CMD 창을 모두 닫은 뒤 START-SERVER.bat 다시 실행하세요.'
    : (err.message || String(err));
  log('ERROR: ' + msg);
  console.error('');
  console.error('*** ' + msg + ' ***');
  console.error('   자세한 내용: client 폴더 안 server-log.txt 확인');
  console.error('');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  log('uncaughtException: ' + (err.message || err));
  process.exit(1);
});
