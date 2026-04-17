import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { executeQuery } from '../config/database';

dotenv.config();

const router = Router();

function createTransporter() {
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT) || 25;
  const secure = (process.env.SMTP_SECURE ?? 'false') === 'true';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  const options: any = { host, port, secure };

  if (user && pass) {
    options.auth = { user, pass };
  } else {
    options.auth = false;
    options.tls = { rejectUnauthorized: false };
  }

  console.log(`[Email] Transporter config: host=${host}, port=${port}, secure=${secure}, auth=${!!(user && pass)}`);
  return nodemailer.createTransport(options);
}

router.post('/send', async (req: Request, res: Response) => {
  const { paramsText, resultText, pageName } = req.body;

  if (!paramsText && !resultText) {
    return res.status(400).json({ status: 'error', message: '전송할 내용이 없습니다.' });
  }

  const smtpHost = process.env.SMTP_HOST || '';
  if (!smtpHost) {
    console.error('[Email] SMTP_HOST가 .env에 설정되지 않았습니다.');
    return res.status(500).json({ status: 'error', message: 'SMTP_HOST가 설정되지 않았습니다. 서버 .env 파일을 확인하세요.' });
  }

  const fromAddress = process.env.SMTP_FROM || 'seahsteeladmin@seah.co.kr';

  let toAddresses: string;
  try {
    const result = await executeQuery<any>(
      `SELECT SF_GET_PDA_MAIL('A') AS EMAIL_ADDR FROM DUAL`
    );
    const row = result.rows?.[0];
    const rawAddr = String(row?.EMAIL_ADDR ?? '').trim();
    if (!rawAddr) {
      console.error('[Email] SF_GET_PDA_MAIL(\'A\') 결과가 비어있습니다.');
      return res.status(400).json({ status: 'error', message: 'SF_GET_PDA_MAIL(\'A\') 결과가 비어있습니다. DB에 이메일을 등록해주세요.' });
    }
    toAddresses = rawAddr;
    console.log(`[Email] SF_GET_PDA_MAIL('A') = '${rawAddr}', from='${fromAddress}', to='${toAddresses}'`);
  } catch (dbErr: any) {
    console.error('[Email] SF_GET_PDA_MAIL query error:', dbErr);
    return res.status(500).json({ status: 'error', message: `이메일 주소 조회 실패: ${dbErr.message || ''}` });
  }

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  const htmlBody = `
    <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 700px;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px;">
        동아스틸 PDA - ${pageName || '전달용'} 데이터
      </h2>
      <p style="color: #64748b; font-size: 13px;">전송 시각: ${now}</p>
      ${paramsText ? `
        <div style="margin: 16px 0;">
          <h3 style="color: #0369a1; margin-bottom: 8px;">📤 전송 파라미터</h3>
          <pre style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; font-size: 12px; white-space: pre-wrap; word-break: break-all; overflow-x: auto;">${paramsText}</pre>
        </div>
      ` : ''}
      ${resultText ? `
        <div style="margin: 16px 0;">
          <h3 style="color: #047857; margin-bottom: 8px;">📥 반환값</h3>
          <pre style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; font-size: 12px; white-space: pre-wrap; word-break: break-all; overflow-x: auto;">${resultText}</pre>
        </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">이 메일은 동아스틸 PDA 시스템에서 자동 전송되었습니다.</p>
    </div>
  `;

  const plainBody = [
    `동아스틸 PDA - ${pageName || '전달용'} 데이터`,
    `전송 시각: ${now}`,
    '',
    paramsText ? `[전송 파라미터]\n${paramsText}` : '',
    '',
    resultText ? `[반환값]\n${resultText}` : '',
  ].filter(Boolean).join('\n');

  const transporter = createTransporter();
  try {
    console.log(`[Email] Sending: from=${fromAddress}, to=${toAddresses}, host=${smtpHost}`);
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toAddresses,
      subject: `[동아스틸 PDA] ${pageName || '전달용'} 데이터 - ${now}`,
      text: plainBody,
      html: htmlBody,
    });
    console.log(`[Email] 전송 성공: messageId=${info.messageId}, response=${info.response}`);

    res.json({ status: 'success', message: `이메일이 ${toAddresses} 으로 전송되었습니다.` });
  } catch (error: any) {
    console.error('[Email] 전송 실패:', error.message);
    console.error('[Email] 상세 오류:', error);
    res.status(500).json({
      status: 'error',
      message: `이메일 전송 실패: ${error.message || '알 수 없는 오류'}`,
    });
  }
});

export default router;
