# Belediye Arıza Takip Sistemi - REST API Dökümantasyonu

**Geliştirici:** [Sevcan Sarıkaya]
**Yayınlanan Domain:** [ https://ariza-takip.onrender.com]

---

##  API Metotları ve Yollar

### 1. Kullanıcı İşlemleri (Auth)

#### **Giriş Yap (Login)**
* **Yol:** `/auth/login`
* **Metot:** `POST`
* **Açıklama:** Kullanıcının sisteme rolüyle birlikte giriş yapmasını sağlar.
* **Request Body:**
```json
{
  "email": "personel@belediye.com",
  "password": "password123",
  "role": "DEPARTMAN"
}
```

### 2. Arıza Kaydı İşlemleri (Faults)

#### **Yeni Arıza Oluştur**
* **Yol:** `/faults`
* **Metot:** `POST`
* **Açıklama:** Yeni bir arıza kaydı oluşturur (Fotoğraf yükleme desteği içerir).
* **Request Body (Multipart/Form-Data):**

| Parametre | Tip | Açıklama |
| :--- | :--- | :--- |
| `deviceName` | String | Arızalı cihazın adı (Örn: Masaüstü PC) |
| `deviceType` | String | Birim adı (Bilişim / Ulaşım / Fen İşleri) |
| `description` | String | Arızanın detaylı açıklaması |
| `priority` | String | Öncelik seviyesi (DÜŞÜK / ORTA / YÜKSEK) |
| `userId` | Number | Kaydı oluşturan personelin benzersiz ID numarası |
| `faultImage` | File | Arızalı cihaza ait fotoğraf dosyası |

---

#### **Tüm Arızaları Listele (Admin)**
* **Yol:** `/faults`
* **Metot:** `GET`
* **Açıklama:** Sistemdeki tüm arıza kayıtlarını veritabanından getirir. (Gereksinim 6)

---

#### **Kullanıcıya Özel Arızaları Listele (Personel)**
* **Yol:** `/faults/user/:userId`
* **Metot:** `GET`
* **Açıklama:** Sadece giriş yapmış olan personelin kendi oluşturduğu geçmiş arıza kayıtlarını listeler. (Gereksinim 8)

---

#### **Arıza Durumunu Güncelle**
* **Yol:** `/faults/:id/status`
* **Metot:** `PUT`
* **Açıklama:** Bilişim personelinin (Admin) arıza kaydının aşamasını değiştirmesini sağlar. (Gereksinim 5)
* **Request Body (JSON):**

```json
{
  "status": "Tamir Edildi"
}
```
---

#### **Teknik Not ve Çözüm Ekleme**
* **Yol:** `/faults/:id/note`
* **Metot:** `PUT`
* **Açıklama:** Bilişim personelinin arıza kaydına teknik açıklama veya çözüm notu eklemesini sağlar. (Gereksinim 7)
* **Request Body (JSON):**
```json
{
  "note": "Anakart üzerindeki kapasitörler değiştirildi."
}
```
---

### 3. Bildirim İşlemleri

#### **Sistem İçi Bildirimleri Getir**
* **Yol:** `/notifications/:userId`
* **Metot:** `GET`
* **Açıklama:** Arıza durumu güncellendiğinde ilgili personele gönderilen sistem içi bildirimleri listeler. (Gereksinim 9)
* **Örnek Yanıt (JSON):**
```json
[
  {
    "id": 1,
    "message": "Kasa (Bilişim) arızanızın durumu 'Tamir Edildi' olarak güncellendi.",
    "isRead": 0,
    "createdAt": "2026-04-10 15:20:10"
  }
]
```