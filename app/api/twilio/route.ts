import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { message, toPhoneNumber, type } = body;

    // type === sms
    let fromPhoneNumber = process.env.TWILIO_NUMBER!;
    if (type === "whatsapp") {
      fromPhoneNumber = `whatsapp:${fromPhoneNumber}`;
      toPhoneNumber = `whatsapp:${toPhoneNumber}`;
    } else if (type !== "sms") {
      throw new Error('Invalid "type" value, must be "sms" or "whatsapp"');
    }

    const res = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: toPhoneNumber,
    });

    return Response.json(
      {
        data: res,
        error: null,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
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
