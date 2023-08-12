"use client";

import styles from "@/styles/page.module.scss";
import { InputAdornment, MenuItem, OutlinedInput, Select } from "@mui/material";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialOptions = {
  clientId:
    "AY5XsZSGSHSaMKiLuIfFysPQSZL-u9Z9puU5Tj84H_dGkC8MXqs-PyzcSKg5zySF21FGiNc8K9bmCXi6",
  currency: "USD",
  intent: "capture",
};

export default function Home() {
  const router = useRouter();

  const [crypto, setCrypto] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(undefined);
  const [mode, setMode] = useState("crypto");

  const handleApprove = (order) => {
    console.log(order);
  };

  const handleChange = (prop) => (e) => {
    switch (prop) {
      case "crypto":
        setCrypto(e.target.value);
        break;
      case "amount":
        setCryptoAmount(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "wallet":
        setWallet(e.target.value);
        break;
      default:
        break;
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const data = {
      method: mode,
      coin: crypto,
      amount: cryptoAmount,
      mail: email,
      wallet,
    };
    const postData = async () => {
      const response = await fetch("/api/exchange", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    };

    postData().then((data) => {
      if (data.invoice) {
        router.push(data.invoice);
      } else {
        alert(data.error);
      }
    });
  };

  return (
    <main className={styles.main}>
      <section className={styles.exchanger}>
        {mode === "crypto" ? (
          <div className={styles.crypto}>
            <h2>Crypto to Paypal</h2>
            <Select
              labelId="crypto-select-label"
              id="crypto-select"
              value={crypto}
              onChange={handleChange("crypto")}
              className={styles.sel}
            >
              <MenuItem value={"btc"}>BTC</MenuItem>
              <MenuItem value={"eth"}>ETH</MenuItem>
              <MenuItem value={"ltc"}>LTC</MenuItem>
              <MenuItem value={"sol"}>SOL</MenuItem>
              <MenuItem value={"usdttrc20"}>USDTTRC20</MenuItem>
              <MenuItem value={"usdc"}>USDC</MenuItem>
            </Select>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={cryptoAmount === undefined ? "" : cryptoAmount}
              onChange={handleChange("amount")}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
              placeholder="0.00"
            />
            <OutlinedInput
              id="outlined-adornment-amount"
              onChange={handleChange("email")}
              placeholder="Paypal mail"
            />
            <button onClick={() => setMode("paypal")}>Switch</button>
          </div>
        ) : (
          <div className={styles.crypto}>
            <h2>Paypal to Crypto</h2>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={cryptoAmount === undefined ? "" : cryptoAmount}
              onChange={handleChange("amount")}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
              placeholder="0.00"
            />
            <Select
              labelId="crypto-select-label"
              id="crypto-select"
              value={crypto}
              onChange={handleChange("crypto")}
              className={styles.sel}
            >
              <MenuItem value={"btc"}>BTC</MenuItem>
              <MenuItem value={"eth"}>ETH</MenuItem>
              <MenuItem value={"ltc"}>LTC</MenuItem>
              <MenuItem value={"sol"}>SOL</MenuItem>
              <MenuItem value={"usdttrc20"}>USDTTRC20</MenuItem>
              <MenuItem value={"usdc"}>USDC</MenuItem>
            </Select>

            <OutlinedInput
              id="outlined-adornment-amount"
              onChange={handleChange("wallet")}
              placeholder="Wallet Address"
            />
            <button onClick={() => setMode("crypto")}>Switch</button>
          </div>
        )}
        {mode === "crypto" ? (
          <button onClick={submit}>Submit</button>
        ) : (
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{ shape: "pill" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: "Sending",
                      amount: {
                        value: 100,
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                const order = await actions.order.capture();
                console.log("Order confirmed: ", order);

                handleApprove(order);
              }}
            />
          </PayPalScriptProvider>
        )}
      </section>
    </main>
  );
}
