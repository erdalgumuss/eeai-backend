import dotenv from 'dotenv';
import express, { Application } from 'express';
import connectDB from './config/db';
import errorHandler from './middlewares//error/errorHandler';
import loadMiddlewares from './middlewares/common';
import loadRoutes from './routes';

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
