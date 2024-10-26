import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: "test@example.com",
  from: "test@example.com", // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

(async () => {
  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
})();

export async function POST(request: Request) {
  return Response.json({
    data: { orderId: "test" },
    error: null,
    message: null,
  });
}
