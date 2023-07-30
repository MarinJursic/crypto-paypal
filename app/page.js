"use client";

import styles from "@/styles/page.module.scss";
import { InputAdornment, MenuItem, OutlinedInput, Select } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
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
            <button
              onClick={() =>
                setMode((prev) => (prev === "crypto" ? "paypal" : "crypto"))
              }
            >
              Switch
            </button>
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
            <button>Switch</button>
          </div>
        )}
      </section>
    </main>
  );
}
