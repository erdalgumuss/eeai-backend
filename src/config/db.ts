import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI tanımlanmamış. Lütfen .env dosyasını kontrol edin.');
    }

    // MongoDB bağlantısı
    const conn = await mongoose.connect(mongoURI); // Ek seçenekler artık gerekli değil

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
    console.log(`Veritabanı Adı: ${conn.connection.name}`);

    // Bağlantı olaylarını dinle
    mongoose.connection.on('connected', () => {
      console.log('MongoDB: Bağlantı başarılı');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB: Bağlantı kesildi.');
    });

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB: Hata oluştu', error);
    });
  } catch (error) {
    console.error(`Veritabanı Bağlantı Hatası: ${error.message}`);
    process.exit(1); // Kritik hata durumunda uygulamayı durdur
  }
};

export default connectDB;