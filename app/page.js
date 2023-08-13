"use client";

import PayPalCheckout from "@/components/PaypalCheckout";
import styles from "@/styles/page.module.scss";
import { InputAdornment, MenuItem, OutlinedInput, Select } from "@mui/material";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";

const initialOptions = {
  clientId:
    "AY5XsZSGSHSaMKiLuIfFysPQSZL-u9Z9puU5Tj84H_dGkC8MXqs-PyzcSKg5zySF21FGiNc8K9bmCXi6",
  currency: "USD",
  intent: "capture",
};

export default function Home() {
  const router = useRouter();

  const [checkout, setCheckOut] = useState(false);

  const [crypto, setCrypto] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(undefined);
  const [mode, setMode] = useState("crypto");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleChange = (prop) => (e) => {
    switch (prop) {
      case "crypto":
        setCrypto((prev) => e.target.value);
        break;
      case "amount":
        console.log(e.target.value);
        setCryptoAmount((prev) => parseInt(e.target.value));
        break;
      case "email":
        setEmail((prev) => e.target.value);
        break;
      case "wallet":
        setWallet((prev) => e.target.value);
        break;
      default:
        break;
    }

    forceUpdate();
  };

  const submit = (e) => {
    e.preventDefault();

    const data = {
      coin: crypto,
      amount: cryptoAmount,
      mail: email,
      wallet,
    };
    const postData = async () => {
      const response = await fetch("/api/payout", {
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

  useEffect(() => {
    if (wallet !== "" && crypto !== "" && cryptoAmount !== undefined) {
    }
  }, [crypto, cryptoAmount, wallet]);

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
          <button
            className="checkout"
            onClick={() => {
              setCheckOut(true);
            }}
          >
            Checkout
          </button>
        )}
        {checkout ? (
          <PayPalCheckout
            amount={cryptoAmount}
            crypto={crypto}
            wallet={wallet}
          />
        ) : null}
      </section>
    </main>
  );
}
