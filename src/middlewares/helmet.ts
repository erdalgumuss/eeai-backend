import helmet from 'helmet';
import { Application } from 'express';

const helmetConfig = (app: Application): void => {
  // Varsayılan Helmet ayarları
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Geliştirme için unsafe-inline kullanılabilir
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
        },
      },
      crossOriginEmbedderPolicy: true,
      referrerPolicy: { policy: 'no-referrer' },
    })
  );
};

export default helmetConfig;
