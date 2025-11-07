const express = require('express');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// === CẤU HÌNH API THESIEURE ===
const API_KEY = "YOUR_THESIEURE_API_KEY";
const API_URL = "https://thesieure.com/chargingws/v2";

// === NẠP THẺ ===
app.post('/api/napthe', async (req, res) => {
  const { seri, code, telco, amount, user } = req.body;
  if (!seri || !code || !telco || !user)
    return res.json({ success: false, message: "Thiếu thông tin" });

  try {
    const response = await axios.post(API_URL, {
      APIkey: API_KEY,
      mathe: code,
      seri: seri,
      menhgia: amount,
      type: telco,
      content: user
    });

    if (response.data.status === 1) {
      res.json({ success: true, message: "Nạp thẻ thành công!", data: response.data });
    } else {
      res.json({ success: false, message: "Nạp thất bại: " + response.data.msg });
    }
  } catch (err) {
    res.json({ success: false, message: "Lỗi server hoặc API" });
  }
});

// === MUA ACC ===
app.get('/api/accounts', async (req, res) => {
  const data = await fs.readJson('./accounts.json');
  res.json(data);
});

app.post('/api/buy', async (req, res) => {
  const { username, accId } = req.body;
  let users = await fs.readJson('./users.json');
  let accounts = await fs.readJson('./accounts.json');

  let user = users.find(u => u.username === username);
  let acc = accounts.find(a => a.id === accId);

  if (!user || !acc) return res.json({ success: false, message: "Không tìm thấy" });
  if (user.balance < acc.price) return res.json({ success: false, message: "Không đủ tiền" });

  user.balance -= acc.price;
  acc.sold = true;

  await fs.writeJson('./users.json', users, { spaces: 2 });
  await fs.writeJson('./accounts.json', accounts, { spaces: 2 });

  res.json({ success: true, message: "Mua thành công!", acc });
});

app.listen(3000, () => console.log('Server chạy tại http://localhost:3000'));
