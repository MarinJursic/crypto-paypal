import React, { useEffect, useRef, useState } from "react";

function PayPalCheckout({ wallet, amount, crypto }) {
  const paypal = useRef();
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: wallet + " " + crypto,
                amount: {
                  currency_code: "USD",
                  value: parseInt(amount),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();

          console.log("success", order);
          let wallet = order.purchase_units[0].description.split(" ")[0];
          let crypto = order.purchase_units[0].description.split(" ")[1];
          let cryptoAmount = parseInt(order.purchase_units[0].amount.value);

          let apiData = {
            wallet: wallet,
            coin: crypto,
            amount: cryptoAmount,
          };
          const response = await fetch("/api/payout", {
            method: "POST",
            body: JSON.stringify(apiData),
          });

          setTransactionStatus("success");
        },
        onError: (err) => {
          console.log(err);
          setTransactionStatus("failure");
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}

export default PayPalCheckout;
