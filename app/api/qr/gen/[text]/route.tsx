import { ImageResponse } from "next/og";
import QRCode from "qrcode";

const generateQR = async (text: string) => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      color: {
        dark: "#000",
        light: "#fff",
      },
      rendererOpts: {
        quality: 1,
      },
      maskPattern: 4,
    });
    return dataUrl;
  } catch (err) {
    console.error(err);
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ text: string }> }
) {
  const { text } = await params;

  const dataUrl = await generateQR(text);

  const QR = () => {
    return <img src={dataUrl} alt="QR Code" width="200" height="200" />;
  };

  return new ImageResponse(QR(), {
    width: 200,
    height: 200,
  });
}
