const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static("public"));
app.use(express.json());

// 🔒 Lấy thông tin từ biến môi trường (Render Environment Variables)
const PARTNER_ID = process.env.PARTNER_ID;
const API_KEY = process.env.API_KEY;

// 🏠 Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 💳 API nạp thẻ
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
    console.error("❌ Lỗi khi gọi API Thesieure:", error.message);
    res.status(500).json({ status: "error", message: "Lỗi khi gọi API Thesieure" });
  }
});

// 🚀 Chạy server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Server đang chạy trên cổng ${port}`);
});
