const express = require('express');
const cors = require('cors');
const db = require('./database'); // Veritabanı bağlantısı
require('dotenv').config();
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
const app = express();
app.use(cors());
app.use(express.json()); // JSON gövdelerini okumak için şart

const PORT = process.env.PORT || 8080;

// --- TEST ROTASI ---
app.get('/', (req, res) => {
    res.send('Belediye Arıza Takip API Canlıda ve Çalışıyor! 🚀');
});

// --- 1) ÜYE OLMA (POST /auth/register) ---
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

// --- 2) GİRİŞ YAPMA (POST /auth/login) ---
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email ve şifre gereklidir." });
    }

    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(sql, [email, password], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Sunucu hatası." });
        }
        if (!user) {
            return res.status(401).json({ error: "Email veya şifre hatalı." });
        }
        
        // Şimdilik JWT olmadan basit bir başarı mesajı ve kullanıcı bilgisi dönüyoruz
        res.status(200).json({
            message: "Giriş başarılı",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                role: user.role
            }
        });
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`✅ Sunucu http://localhost:${PORT} adresinde aktif.`);
});