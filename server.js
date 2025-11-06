const crypto = require("crypto");

const command = "charging";
const sign = crypto
  .createHash("md5")
  .update(PARTNER_ID + code + seri + loaithe + command + API_KEY)
  .digest("hex");

const response = await axios.post("https://thesieure.com/chargingws/v2", {
  partner_id: PARTNER_ID,
  sign: sign,
  code: code,
  serial: seri,
  telco: loaithe,
  amount: menhgia,
  command: command
});
