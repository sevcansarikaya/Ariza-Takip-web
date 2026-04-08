const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const fs = require('fs'); 

if (!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads', { recursive: true });
}
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'public/uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.post('/auth/register', (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
        return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
    }

    const sql = `INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)`;
    const params = [email, password, firstName, lastName, role];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: "Bu email adresi zaten kayıtlı veya geçersiz veri." });
        }
        res.status(201).json({
            message: "Kullanıcı başarıyla oluşturuldu",
            userId: this.lastID
        });
    });
});


app.post('/auth/login', (req, res) => {
    const { email, password, role, adminKey } = req.body;

    if (role === 'ADMIN') {
        if (adminKey !== 'BELEDIYE123') { 
            return res.status(403).json({ error: "Yetkili giriş anahtarı hatalı!" });
        }
    }

    const sql = `SELECT * FROM users WHERE email = ? AND password = ? AND role = ?`;
    db.get(sql, [email, password, role], (err, user) => {
        if (err) return res.status(500).json({ error: "Sunucu hatası." });
        if (!user) return res.status(401).json({ error: "Giriş bilgileri veya yetki hatalı." });
        
        res.status(200).json({
            message: "Giriş başarılı",
            user: { id: user.id, firstName: user.firstName, role: user.role }
        });
    });
});

app.post('/faults', upload.single('faultImage'), (req, res) => {
    const { deviceName, deviceType, description, priority, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO faults (deviceName, deviceType, description, priority, userId, status, imageUrl) VALUES (?, ?, ?, ?, ?, 'Beklemede', ?)`;
    db.run(sql, [deviceName, deviceType, description, priority, userId, imageUrl], function(err) {
        if (err) return res.status(400).json({ error: "Kayıt hatası." });
        res.status(201).json({ message: "Kayıt oluşturuldu" });
    });
});


app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
});