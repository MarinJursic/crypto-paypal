export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    if (data.method === "crypto") {
      if (!data.coin || !data.amount || !data.mail) {
        res.status(400).send("Invalid or missing data");
        return;
      }

      // CONTINUE CRYPTO -> PAYPAL EXCHANGE

      console.log(
        `COIN: ${data.coin} \n AMOUNT: ${data.amount} \n MAIL: ${data.mail}`
      );
    } else if (data.method === "paypal") {
      if (!data.coin || !data.amount || !data.wallet) {
        res.status(400).send("Invalid or missing data");
        return;
      }

      // CONTINUE PAYPAL -> CRYPTO EXCHANGE

      console.log(
        `COIN: ${data.coin} \n AMOUNT: ${data.amount} \n WALLET: ${data.wallet}`
      );
    } else {
      res.status(400).send("Invalid exchange mode");
      return;
    }
  } else {
    res.status(400).send("Bad request");
  }
}
