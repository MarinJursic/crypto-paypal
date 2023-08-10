import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  let message = "";

  if (data.method === "crypto") {
    if (!data.coin || !data.amount || !data.mail) {
      return NextResponse.json(
        { error: "Invalid or missing data." },
        { status: 400 }
      );
    }

    // CONTINUE CRYPTO -> PAYPAL EXCHANGE

    console.log();

    message = `Successfuly transfered $${data.amount} worth of ${data.coin} to ${data.mail}!`;
  } else if (data.method === "paypal") {
    if (!data.coin || !data.amount || !data.wallet) {
      return NextResponse.json(
        { error: "Invalid or missing data." },
        { status: 400 }
      );
    }

    // CONTINUE PAYPAL -> CRYPTO EXCHANGE

    message = `Successfuly transfered $${data.amount} worth of ${data.coin} to ${data.wallet}!`;
  } else {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  return NextResponse.json({ ...data, message });
}
