# Belediye Arıza Takip Sistemi - Frontend Dökümantasyonu

**Geliştirici:** [Sevcan Sarıkaya]
**Yayındaki Canlı Adres:** [https://ariza-takip.onrender.com]

Bu döküman, projenin 4. aşaması kapsamında geliştirilen web arayüzü özelliklerini ve arayüzün API metotlarıyla olan entegrasyonunu içermektedir.

---

## Arayüz Özellikleri ve Gereksinim Eşleşmeleri

| Gereksinim No | Özellik Adı | Açıklama |
| :--- | :--- | :--- |
| **G1 & G2** | Giriş ve Rol Kontrolü | `localStorage` kullanılarak kullanıcı oturumu ve yetki seviyesi (Admin/Personel) yönetilmektedir. |
| **G3 & G4** | Arıza Kaydı ve Fotoğraf | `FormData` API kullanılarak metin verileri ve görsel dosyaları eş zamanlı olarak sunucuya iletilmektedir. |
| **G5 & G7** | Durum ve Not Yönetimi | Admin panelinde arıza durumları anlık güncellenebilmekte ve teknik notlar eklenebilmektedir. |
| **G6** | Filtreleme Sistemi | Departman bazlı ve durum bazlı filtreleme butonları ile kullanıcı arayüzünde dinamik listeleme yapılmaktadır. |
| **G9** | Bildirim Sistemi | Arıza durum değişikliği yapıldığında personel ekranında sistem içi bildirim mekanizması çalışmaktadır. |
| **G10** | İstatistik Paneli | Dashboard üzerinde toplam, bekleyen ve onarılan arıza sayıları dinamik olarak hesaplanmaktadır. |

---

##  Tasarım Detayları
* **Teknoloji:** HTML5, CSS3, JavaScript (Vanilla JS).
* **Responsive Tasarım:** Arayüz, mobil ve masaüstü cihazlarla uyumlu (Responsive) şekilde tasarlanmıştır.
* **UX/UI:** Kullanıcı deneyimini artırmak için işlem sonrası "Başarılı" uyarıları ve otomatik form temizleme özellikleri eklenmiştir.

---

## ✅ Doğrulama
Web arayüzü üzerinden yapılan tüm işlemler veritabanı ile senkronize çalışmaktadır. Doğru çalıştığına dair kanıt videoları ve ekran görüntüleri proje klasöründe yer almaktadır.