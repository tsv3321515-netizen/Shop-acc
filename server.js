const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(express.static("public"));
app.use(express.json());

// 🔐 Biến môi trường (Render / .env)
const PARTNER_ID = process.env.PARTNER_ID;
const API_KEY = process.env.API_KEY;

// 📂 Đường dẫn file dữ liệu
const USERS_FILE = path.join(__dirname, "users.json");
const ACCOUNTS_FILE = path.join(__dirname, "accounts.json");

// 🏠 Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🧑‍💻 Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

  res.json({ success: true, balance: user.balance });
});

// 💳 Nạp thẻ (Thesieure API)
app.post("/api/napthe", async (req, res) => {
  const { username, card_type, pin, seri, amount } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

  try {
    const response = await axios.post("https://thesieure.com/chargingws/v2", {
      partner_id: PARTNER_ID,
      api_key: API_KEY,
      code: pin,
      serial: seri,
      telco: card_type,
      amount: amount,
      request_id: Date.now().toString(),
      command: "charging"
    });

    if (response.data.status === 1) {
      user.balance += parseInt(amount);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      res.json({ success: true, message: "Nạp thành công!", balance: user.balance });
    } else {
      res.json({ success: false, message: "Thẻ lỗi hoặc sai mệnh giá" });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Lỗi máy chủ nạp thẻ" });
  }
});

// 🛒 Mua acc
app.post("/api/mua", (req, res) => {
  const { username, accId } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE));

  const user = users.find((u) => u.username === username);
  const acc = accounts.find((a) => a.id === accId && !a.sold);

  if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
  if (!acc) return res.status(404).json({ success: false, message: "Acc đã bán hoặc không tồn tại" });
  if (user.balance < acc.price) return res.json({ success: false, message: "Không đủ tiền" });

  user.balance -= acc.price;
  acc.sold = true;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));

  res.json({ success: true, message: "Mua thành công!", balance: user.balance, acc });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
