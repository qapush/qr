// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

import QRCode from "qrcode-svg";
import pkg from 'convert-svg-to-jpeg';
import chromium from "@sparticuz/chromium";


const handler = async (req) => {



  let data;
  const localChromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const { convert } = pkg;

  try {
    data = await req.json()
  }
  catch (e) {
    console.log(e)
    return new Response(`[ERROR] Invalid JSON - ${e.message}`, { status: 400 })
  }


  try {
    const { name, phone, email, company, jobTitle } = data;

    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
ORG:${company}
TITLE:${jobTitle}
END:VCARD`;
    const qr = new QRCode(vCardData);
    const qrSvg = qr.svg();
    const buff = Buffer.from(qrSvg);
    const qrCodeUrl = `data:image/svg+xml;base64,${buff.toString('base64')}`;

    const jbegBuffer = await convert(qrSvg, {
      puppeteer: {
        executablePath: process.env.CONTEXT === 'dev' ? localChromePath : await chromium.executablePath(),
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless,
      }
    });

    
    const jpegBase64 = jbegBuffer.toString('base64');


    return new Response(JSON.stringify({ qrCodeUrl, name, jpegBase64 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Failed to generate QR code' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export default handler;