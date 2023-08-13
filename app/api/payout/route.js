const NowPaymentsApi = require("@nowpaymentsio/nowpayments-api-js");
import { NextResponse } from "next/server";

export async function POST(req) {
  let data = await req.json();

  data = {
    coin: "btc",
    amount: 0,
    wallet: "bc1qyfu98f8llht3gjnfj6gzptj9xtvysq7nzrjz2w",
  };

  const npApi = new NowPaymentsApi({ apiKey: process.env.NPApi });
  /*
  if (!data.coin || !data.amount || !data.wallet) {
    return NextResponse.json(
      { error: "Invalid or missing data." },
      { status: 400 }
    );
  }
  */

  var myHeadersToken = new Headers();
  myHeadersToken.append("Content-Type", "application/json");

  var rawToken =
    '{\n    "email": "brkic123antonio@gmail.com",\n    "password": "Pomorska123456%" \n}';

  var requestOptionsToken = {
    method: "POST",
    headers: myHeadersToken,
    body: rawToken,
    redirect: "follow",
  };

  fetch("https://api.nowpayments.io/v1/auth", requestOptionsToken)
    .then((response) => response.text())
    .then((token) => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${JSON.parse(token).token}`);
      myHeaders.append("x-api-key", process.env.NPApi);
      myHeaders.append("Content-Type", "application/json");

      const withdrawalConfig = {
        address: data.wallet,
        currency: data.coin,
        amount: 0,
        fiat_amount: data.amount,
        ipn_callback_url: "https://crypto-paypal.vercel.app/api/payment",
      };

      var raw = JSON.stringify({
        ipn_callback_url: "https://crypto-paypal.vercel.app/api/payment",
        withdrawals: [withdrawalConfig],
      });

      var requestOptionsPayout = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://api.nowpayments.io/v1/payout", requestOptionsPayout)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));

      data.message = `Successfuly transfered $${data.amount} worth of ${data.coin} to ${data.mail}!`;
    })
    .catch((error) => console.log("Fetching token error: ", error));

  // return NextResponse.json({ ...data });
}
