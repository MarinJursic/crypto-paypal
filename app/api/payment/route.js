import { NextResponse } from "next/server";

const crypto = require("crypto");
const CoinGecko = require("coingecko-api");

const CoinGeckoClient = new CoinGecko();

export async function POST(req) {
  const payment = await req.json();

  const hmac = crypto.createHmac("sha512", process.env.NPnotificationsKey);
  hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort()));
  const signature = hmac.digest("hex");

  let valid = payment.payment_status === "confirmed";

  const price = payment.price_amount;
  const paidBased = payment.actually_paid;

  let paid = paidBased;

  const currencies = {
    btc: "bitcoin",
    eth: "ethereum",
    ltc: "litecoin",
    sol: "solana",
  };

  if (payment.pay_currency !== "usdttrc20") {
    let cryptoData = await CoinGeckoClient.coins.fetch("bitcoin", {});

    paid *= cryptoData.data.market_data.current_price.usd;
  }

  if (
    payment.payment_status === "partially_paid" &&
    parseFloat(price) - parseFloat(paid) <= parseFloat(price) * 0.1
  ) {
    valid = true;
  }

  if (
    payment.payment_status === "finished" ||
    payment.payment_status === "confirmed"
  ) {
    valid = true;
  }

  if (valid && signature === req.headers["x-nowpayments-sig"]) {
    console.log(
      `${payment.order_id} SENT $${payment.price_amount} of ${payment.pay_currency}!`
    );

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
