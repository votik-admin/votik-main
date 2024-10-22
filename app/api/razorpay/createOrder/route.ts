import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, currency } = body;

  const options = {
    amount, // in paise
    currency,
    receipt: "receipt#1", // receipt id MAX 40 characters
    notes: {
      // Maximum 15 key-value pairs, 256 characters (maximum) each
      key1: "value3",
      key2: "value2",
    },
  };
  const order = await razorpay.orders.create(options);
  console.log(order);
  return Response.json({ orderId: order.id }, { status: 200 });
}
