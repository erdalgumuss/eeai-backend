import { Application } from 'express';
import cors from 'cors';
import express from 'express';
import helmetConfig from './helmet';
import morganConfig from './morgan';

const loadMiddlewares = (app: Application): void => {
  // CORS yapılandırması
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.use(
    cors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    })
  );

  // Helmet güvenlik başlıkları
  helmetConfig(app);

  // Morgan loglama
  morganConfig(app);

  // JSON gövde çözümleyici
  app.use(express.json());
};

export default loadMiddlewares;
