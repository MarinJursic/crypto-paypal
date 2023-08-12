const NowPaymentsApi = require("@nowpaymentsio/nowpayments-api-js");
import { NextResponse } from "next/server";

export async function POST(req) {
  let data = await req.json();

  const npApi = new NowPaymentsApi({ apiKey: process.env.NPApi });

  if (data.method === "crypto") {
    if (!data.coin || !data.amount || !data.mail) {
      return NextResponse.json(
        { error: "Invalid or missing data." },
        { status: 400 }
      );
    }

    // CONTINUE CRYPTO -> PAYPAL EXCHANGE

    const config = {
      price_amount: data.amount,
      price_currency: "usd",
      order_id: data.mail,
      pay_currency: data.coin,
      order_description: "Exchange crypto to paypal",
      success_url: "https://crypto-paypal.vercel.app/order?success=true",
      cancel_url: "https://crypto-paypal.vercel.app/order?success=false",
      ipn_callback_url: "https://crypto-paypal.vercel.app/api/payment",
    };

    const invoice = await npApi.createInvoice(config);

    data.message = `Successfuly transfered $${data.amount} worth of ${data.coin} to ${data.mail}!`;
    data.invoice = invoice.invoice_url;
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

  return NextResponse.json({ ...data });
}
