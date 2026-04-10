const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const multer = require("multer");

const app = express();


const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));


app.post("/auth/register", (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }

  const sql = `INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [email, password, firstName, lastName, role], function (err) {
    if (err) return res.status(400).json({ error: "Kayıt hatası (Email zaten var)." });
    res.status(201).json({ message: "Başarıyla kayıt olundu.", userId: this.lastID });
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password, role, adminKey } = req.body;
  if (role === "ADMIN" && adminKey !== "BELEDIYE123") {
    return res.status(403).json({ error: "Admin anahtarı hatalı!" });
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ? AND role = ?`;
  db.get(sql, [email, password, role], (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Giriş bilgileri hatalı." });
    res.status(200).json({ message: "Giriş başarılı", user: { id: user.id, firstName: user.firstName, role: user.role } });
  });
});


app.post("/faults", (req, res) => {
  const { deviceName, deviceType, description, priority, userId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;


  
  const sql = `INSERT INTO faults (deviceName, deviceType, description, priority, userId, status, imageUrl) VALUES (?, ?, ?, ?, ?, 'Beklemede', ?)`;
  db.run(sql, [deviceName, deviceType, description, priority, userId, imageUrl], function (err) {
    if (err) return res.status(500).json({ error: "Veritabanı kayıt hatası." });
    res.status(201).json({ message: "Arıza kaydı başarıyla oluşturuldu." });
  });
});

app.get("/faults", (req, res) => {
  const sql = `SELECT * FROM faults ORDER BY id DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Veri çekme hatası" });
    res.json(rows);
  });
});

app.get("/faults/user/:id", (req, res) => {

  const sql = `SELECT * FROM faults WHERE userId = ? ORDER BY id DESC`;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Veri çekme hatası." });
    res.status(200).json(rows);
  });
});

app.put("/faults/:id/status", (req, res) => {
  const { status, userId, techNote } = req.body; 
  const faultId = req.params.id;

  const sql = `UPDATE faults SET status = ?, techNote = ? WHERE id = ?`;
  db.run(sql, [status, techNote || "", faultId], function (err) {
    if (err) return res.status(500).json({ error: "Güncelleme hatası." });

    if (userId) {
      const msg = `Arıza #${faultId} durumu '${status}' olarak güncellendi. Not: ${techNote || 'Yok'}`;
      db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [userId, msg]);
    }

    res.status(200).json({ message: "Durum ve teknik not güncellendi, bildirim gönderildi." });
  });
});


app.get("/notifications/:userId", (req, res) => {
  db.all("SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC", [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Bildirim hatası" });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
});
