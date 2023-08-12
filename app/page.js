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
      router.push(data.invoice);
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
              <MenuItem value={"BTC"}>BTC</MenuItem>
              <MenuItem value={"BCH"}>BCH</MenuItem>
              <MenuItem value={"LTC"}>LTC</MenuItem>
              <MenuItem value={"usdttrc20"}>USDT-TRC20</MenuItem>
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
              <MenuItem value={"BTC"}>BTC</MenuItem>
              <MenuItem value={"BCH"}>BCH</MenuItem>
              <MenuItem value={"LTC"}>LTC</MenuItem>
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
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        )}
      </section>
    </main>
  );
}
