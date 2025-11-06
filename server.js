const express = require("express");
const md5 = require("md5");
const bodyParser = require("body-parser");
const { PARTNER_ID, API_KEY } = require("./config.js");

// node-fetch fix cho CommonJS
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.json());

app.post("/api/napthe", async (req, res) => {
  const { telco, code, serial, amount } = req.body;
  const request_id = Math.floor(Math.random() * 1000000000).toString();
  const sign = md5(PARTNER_ID + code + serial + API_KEY);

  try {
    const response = await fetch("https://thesieure.com/chargingws/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partner_id: PARTNER_ID,
        sign,
        code,
        serial,
        telco,
        amount,
        request_id
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ hoặc API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server đang chạy cổng ${PORT}`));
