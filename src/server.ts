import dotenv from 'dotenv';
import express, { Application } from 'express';
import connectDB from './config/db';
import errorHandler from './middlewares//error/errorHandler';
import loadMiddlewares from './middlewares/common';
import loadRoutes from './routes';
import rateLimit from 'express-rate-limit';
dotenv.config();

// Dotenv yalnızca belirli ortamlar için çalıştırılır
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  dotenv.config();
}

// Ortam değişkenleri kontrolü
if (!process.env.PORT || !process.env.MONGO_URI) {
  throw new Error('Gerekli ortam değişkenleri tanımlanmamış!');
}

const app: Application = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakika içinde en fazla 100 istek
  message: 'Çok fazla istek yaptınız, lütfen daha sonra tekrar deneyiniz.',
});

app.use(limiter);


// Veritabanı bağlantısı
connectDB();

// Orta katmanlar (Middlewares)
loadMiddlewares(app);

// Rotalar (dinamik olarak yüklenir)
loadRoutes(app);

// Genel hata yönetimi middleware'i
app.use(errorHandler);

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} numaralı portta çalışıyor.`);
});
