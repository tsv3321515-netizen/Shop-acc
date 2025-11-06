const express = require("express");
const app = express();
const path = require("path");

// Cho phép phục vụ các file tĩnh (HTML, CSS, JS...) trong thư mục "public"
app.use(express.static("public"));

// Khi truy cập trang chủ "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Cổng Render sẽ tự động gán (hoặc mặc định là 10000)
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
