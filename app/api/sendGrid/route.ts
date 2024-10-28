import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: "marvelousprince012233@gmail.com",
  from: "mmpl@votik.app",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, <u>this is completely different</u> even with Node.js</strong>",
};

export async function GET(request: Request) {
  try {
    const res = await sgMail.send(msg);
    return Response.json(
      {
        data: res,
        error: null,
        message: null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        data: null,
        error: error,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
