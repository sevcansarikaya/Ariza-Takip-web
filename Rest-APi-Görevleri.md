# 🚀 Arıza Takip Sistemi REST API Metotları

> **API Test Videosu:** [Link buraya eklenecek]

---

### 1) Üye Olma

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "kullanici@belediye.com",
  "password": "Guvenli123!",
  "firstName": "Sevcan",
  "lastName": "Sarıkaya",
  "role": "DEPARTMAN"
}```

**Response:** `201 Created – Kullanıcı başarıyla oluşturuldu`

**Hata:** `400 Bad Request – Geçersiz veri`

## 2) Giriş Yapma

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "kullanici@belediye.com",
  "password": "Guvenli123!"
}

**Response:** `200 OK – Giriş başarılı (JWT Token döner)`

**Hata:** `401 Unauthorized – Email veya şifre hatalı`

### 3) Kullanıcı Bilgilerini Görüntüleme

**Endpoint:** `GET /users/{userId}`

**Path Parameters:**
* `userId` (string, required) – Kullanıcı ID’si

**Authentication:** * `Bearer Token` gerekli

**Response:** * `200 OK` – Kullanıcı bilgileri başarıyla getirildi

**Hata:** * `404 Not Found` – Kullanıcı bulunamadı
### 4) Yeni Arıza Kaydı Oluşturma

**Endpoint:** `POST /faults`

**Authentication:** `Bearer Token` gerekli (DEPARTMAN)

**Request Body:**

```json
{
  "deviceName": "HP Yazıcı",
  "deviceType": "Yazici",
  "description": "Kağıt sıkışması sorunu var",
  "priority": "ORTA"
}
### 5) Arıza Listeleme

**Endpoint:** `GET /faults`

**Authentication:** `Bearer Token` gerekli

**Query Parameters (Opsiyonel):**
* `status` (string) – Arıza durumu filtreleme
* `priority` (string) – Öncelik filtreleme

**Response:** `200 OK` – Arıza listesi başarıyla getirildi
### 6) Arıza Detay Görüntüleme

**Endpoint:** `GET /faults/{faultId}`

**Path Parameters:**
* `faultId` (string, required) – Arıza ID’si

**Authentication:** `Bearer Token` gerekli

**Response:** `200 OK` – Arıza detayı başarıyla getirildi

**Hata:** `404 Not Found` – Arıza kaydı bulunamadı

7. Arıza Durumu Güncelleme
Endpoint: PUT /faults/{faultId}
Path Parameters:
faultId (string, required)
Authentication: Bearer Token gerekli (ADMIN / BİLİŞİM)
Request Body:
{
  "status": "INCELEMEDE",
  "solutionNote": "Parça sipariş edildi"
}
**Response:** `200 OK – Arıza durumu güncellendi`
**Hata:** `403 Forbidden – Yetkisiz işlem`

### 8) Arızaya Fotoğraf Yükleme

**Endpoint:** `POST /faults/{faultId}/upload-photo`

**Path Parameters:**
* `faultId` (string, required)

**Authentication:** `Bearer Token` gerekli

**Request Type:** `multipart/form-data`

**Body:**
* `file` (image, required)

**Response:** `200 OK` – Fotoğraf başarıyla yüklendi
### 9) Arıza Silme

**Endpoint:** `DELETE /faults/{faultId}`

**Path Parameters:**
* `faultId` (string, required)

**Authentication:** `Bearer Token` gerekli (ADMIN)

**Response:** `200 OK` – Arıza kaydı silindi

**Hata:** `404 Not Found` – Kayıt bulunamadı

### 10) Raporlama (İstatistik)

**Endpoint:** `GET /reports`

**Authentication:** `Bearer Token` gerekli (ADMIN)

**Response Body:**

```json
{
  "totalFaults": 120,
  "openFaults": 25,
  "closedFaults": 95
}