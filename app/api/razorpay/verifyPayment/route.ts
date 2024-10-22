import crypto from "crypto";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { orderCreationId, razorpayPaymentId, razorpaySignature } = body;

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return Response.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }
  return Response.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 }
  );
}
