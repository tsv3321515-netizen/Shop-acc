const express = require("express");
const path = require("path");
const axios = require("axios");
const { PARTNER_ID, API_KEY } = require("./config.js");

const app = express();
app.use(express.static("public"));
app.use(express.json());

// Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API nạp thẻ
app.post("/api/napthe", async (req, res) => {
  try {
    const { seri, code, menhgia, loaithe } = req.body;

    const response = await axios.post("https://thesieure.com/chargingws/v2", {
      partner_id: PARTNER_ID,
      sign: API_KEY,
      code: code,
      serial: seri,
      telco: loaithe,
      amount: menhgia,
      command: "charging"
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Lỗi khi gọi API Thesieure" });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
