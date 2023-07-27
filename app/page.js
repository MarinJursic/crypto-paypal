"use client";

import styles from "@/styles/page.module.scss";
import { InputAdornment, MenuItem, OutlinedInput, Select } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [crypto, setCrypto] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(undefined);

  const handleChange = (prop) => (e) => {
    if (prop === "crypto") {
      setCrypto(e.target.value);
    } else if (prop === "amount") {
      setCryptoAmount(e.target.value);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.exchanger}>
        <div className={styles.crypto}>
          <h2>Select Crypto</h2>
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
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            placeholder="0.00"
          />
        </div>
      </section>
    </main>
  );
}
