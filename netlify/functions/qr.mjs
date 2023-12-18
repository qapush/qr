// import svgToImg from "svg-to-img";
// import QRCode from "qrcode-svg";
const QRCode = require("qrcode-svg");
const svgToImg = require("svg-to-img");

const handler = async (req) => {


  
  let data;

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

  
    const jpegBase64 = await svgToImg.from(qrSvg).toJpeg({encoding: "base64"})
    


    return new Response(JSON.stringify({ qrCodeUrl,jpegBase64, name }), {
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