const express = require("express");
const cors = require("cors");
const db = require("./database");
require("dotenv").config();


const app = express();
const fs = require("fs");

if (!fs.existsSync("public/uploads")) {
  fs.mkdirSync("public/uploads", { recursive: true });
}
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use(express.static("public"));


app.post("/auth/register", (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
  }

  const sql = `INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)`;
  const params = [email, password, firstName, lastName, role];

  db.run(sql, params, function (err) {
    if (err) {
      return res
        .status(400)
        .json({ error: "Bu email adresi zaten kayıtlı veya geçersiz veri." });
    }
    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      userId: this.lastID,
    });
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password, role, adminKey } = req.body;

  if (role === "ADMIN") {
    if (adminKey !== "BELEDIYE123") {
      return res.status(403).json({ error: "Yetkili giriş anahtarı hatalı!" });
    }
  }

  const sql = `SELECT * FROM users WHERE email = ? AND password = ? AND role = ?`;
  db.get(sql, [email, password, role], (err, user) => {
    if (err) return res.status(500).json({ error: "Sunucu hatası." });
    if (!user)
      return res
        .status(401)
        .json({ error: "Giriş bilgileri veya yetki hatalı." });

    res.status(200).json({
      message: "Giriş başarılı",
      user: { id: user.id, firstName: user.firstName, role: user.role },
    });
  });
});

app.post("/faults", upload.single("faultimage"), (req, res) => {
  const { deviceName, deviceType, description, priority, userId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO faults (deviceName, deviceType, description, priority, userId, status, imageUrl) VALUES (?, ?, ?, ?, ?, 'Beklemede', ?)`;
  db.run(
    sql,
    [deviceName, deviceType, description, priority, userId, imageUrl],
    function (err) {
      if (err) return res.status(400).json({ error: "Kayıt hatası." });
      res.status(201).json({ message: "Kayıt oluşturuldu" });
    },
  );
});

app.get("/faults", (req, res) => {
  const role = req.query.role;
  const userId = req.query.userId;

  let sql;
  let params = [];

  if (role === "ADMIN") {
    sql = `SELECT * FROM faults ORDER BY id DESC`;
  } else if (userId) {
    sql = `SELECT * FROM faults WHERE userId = ?`;
    params = [userId];
  } else {
    sql = `SELECT * FROM faults ORDER BY id DESC`;
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: "Veri çekme hatası" });
    res.json(rows);
  });
});

app.get("/faults/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM faults WHERE userId = ? ORDER BY id DESC`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Veri çekme hatası." });
    res.status(200).json(rows);
  });
});

app.put("/faults/:id/status", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const sql = `UPDATE faults SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function (err) {
    if (err) return res.status(500).json({ error: "Güncelleme hatası." });
    res.status(200).json({ message: "Durum güncellendi" });
  });
});

app.get("/notifications/:userId", (req, res) => {
  db.all(
    "SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC",
    [req.params.userId],
    (err, rows) => {
      res.json(rows);
    },
  );
});

app.put("/faults/:id/status", (req, res) => {
  const { status, userId } = req.body;
  db.run(
    "UPDATE faults SET status = ? WHERE id = ?",
    [status, req.params.id],
    function (err) {
      if (!err) {
        const msg = `Arıza kaydınızın durumu '${status}' olarak güncellendi.`;
        db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [
          userId,
          msg,
        ]);
        res.json({ message: "Güncellendi ve bildirim gönderildi." });
      }
    },
  );
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
});
