EEAI Backend README
Proje Açıklaması
Bu proje, şirketler için çoklu kullanıcı destekli bir insan kaynakları yönetim sistemidir. Şirketler, mülakat oluşturabilir, sorular ekleyebilir ve yönetebilir. Mülakatlar, şirketler arasında izole edilir ve sadece ilgili şirketin kullanıcıları tarafından görüntülenebilir.

Proje Özellikleri
Kullanıcı Yönetimi:

Şirket kaydı ve giriş işlemleri.
Şirketlerin kendi verileri dışında başka şirketlerin verilerine erişememesi.
Soru Yönetimi:

Şirketler kendi sorularını oluşturabilir.
Sorular private (şirkete özel) veya public (herkesin erişebileceği) olabilir.
Soruları konu, tag veya başlık ile filtreleme desteği.
Soruların kullanım sayısı, beğeni sayısı ve zorluk derecesi gibi bilgilerin tutulması.
Mülakat Yönetimi:

Şirketler, sorular ve kişilik testlerinden oluşan mülakatlar oluşturabilir.
Mülakatların aktif, pasif veya tamamlanmış durumları tutulur.
Public mülakat başlığı ve başvuru sayısı gibi bilgilerin gösterimi.
Güvenlik:

Şifrelerin bcrypt ile hashlenerek saklanması.
JWT tabanlı yetkilendirme.
Token doğrulama ve rol bazlı erişim kontrolleri.
Postman Koleksiyonu:

API uç noktalarını test etmek için Postman koleksiyonu.
Proje Yapısı
plaintext
Kodu kopyala
src/
├── config/                   # Veritabanı bağlantı ayarları
├── controllers/              # API işlevlerini yöneten dosyalar
│   ├── company/              # Şirket kontrolörleri
│   ├── interview/            # Mülakat kontrolörleri
│   └── question/             # Soru kontrolörleri
├── middlewares/              # Yetkilendirme ve hata yönetimi
├── models/                   # Veritabanı modelleri
│   ├── company/Company.ts    # Şirket modeli
│   ├── interview/Interview.ts# Mülakat modeli
│   └── interview/Question.ts # Soru modeli
├── routes/                   # Uç nokta yönlendirmeleri
│   ├── companies.ts          # Şirket rotaları
│   ├── interviews.ts         # Mülakat rotaları
│   └── questions.ts          # Soru rotaları
├── services/                 # İş mantığını yöneten dosyalar
│   ├── companyService/       # Şirket işlemleri
│   ├── interviewService/     # Mülakat işlemleri
│   └── questionService/      # Soru işlemleri
└── utils/                    # Yardımcı fonksiyonlar
    ├── hashUtils.ts          # Şifreleme
    └── jwtUtils.ts           # JWT işlemleri
Kurulum ve Çalıştırma
Gereksinimler
Node.js v16+
MongoDB
Postman (isteğe bağlı)
Kurulum
Depoyu Klonla:

bash
Kodu kopyala
git clone <repository-url>
cd eeai-backend
Bağımlılıkları Yükle:

bash
Kodu kopyala
npm install
Çevresel Değişkenler: .env dosyasını oluştur ve aşağıdaki değerleri ekle:

plaintext
Kodu kopyala
MONGO_URI=<MongoDB bağlantı URI>
JWT_SECRET=<JWT gizli anahtarı>
BASE_URL=http://localhost:5000
PORT=5000
Veritabanını Başlat: MongoDB'nin çalıştığından emin olun.

Sunucuyu Başlat:

bash
Kodu kopyala
npm run dev
API Kullanımı
1. Şirket Kaydı
Endpoint: POST /companies/register
Body:
json
Kodu kopyala
{
  "companyName": "Example Company",
  "email": "example1@company.com",
  "password": "securepassword123"
}
2. Şirket Girişi
Endpoint: POST /companies/login

Body:

json
Kodu kopyala
{
  "email": "example1@company.com",
  "password": "securepassword123"
}
Başarılı Yanıt:

json
Kodu kopyala
{
  "token": "<jwt_token>",
  "message": "Başarılı giriş"
}
3. Soru Ekleme
Endpoint: POST /questions/add
Headers:
Authorization: Bearer <token>
Body:
json
Kodu kopyala
{
  "questionText": "Postman nedir?",
  "timeLimit": 60,
  "topic": "API Testing",
  "tags": ["postman", "testing"],
  "difficulty": "beginner",
  "isPublic": true
}
4. Mülakat Oluşturma
Endpoint: POST /interviews/add
Headers:
Authorization: Bearer <token>
Body:
json
Kodu kopyala
{
  "title": "API Test Mülakatı",
  "type": "questions_only",
  "questions": ["<Question ID>"],
  "expirationDate": "2024-12-31T23:59:59.000Z",
  "stages": {
    "questionnaire": true
  }
}
Test
Postman Kullanımı
Koleksiyon İndirme:

Postman koleksiyonunu paylaşabilirsiniz (.json formatında).
Postman Koleksiyon Çalıştırma:

Postman Runner ile testleri otomatik çalıştırabilirsiniz.
Ekip ve Katkı
Proje geliştirilirken aşağıdaki araçlar ve yöntemler kullanılmıştır:

Node.js ve TypeScript
MongoDB için Mongoose ODM
Postman ile API testi
JWT tabanlı yetkilendirme
Katkıda bulunmak için CONTRIBUTING.md dosyasını kontrol edin.

Lisans
Bu proje EEAI Lisansı altında lisanslanmıştır..