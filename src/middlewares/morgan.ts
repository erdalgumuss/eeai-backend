import morgan from 'morgan';
import { Application } from 'express';

const morganConfig = (app: Application): void => {
  // Geliştirme ortamında daha okunabilir loglama
  const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

  // Morgan'ı uygulamaya ekle
  app.use(morgan(logFormat));
};

export default morganConfig;
