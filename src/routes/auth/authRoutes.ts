import { Router } from 'express';
import { registerAccount, loginCompany, logoutCompany } from '../../controllers/auth/authController';
import { refreshAccessToken } from '../../controllers/auth/authController';
import auth from '../../middlewares/auth/auth';
import rateLimit from 'express-rate-limit';

const router = Router();
// Giriş için özel rate limit
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 10, // Her IP için 15 dakika içinde en fazla 10 giriş denemesi
    message: 'Çok fazla giriş denemesi yaptınız, lütfen daha sonra tekrar deneyiniz.',
  });
  
  
// Şirket kaydı
router.post('/register', registerAccount);

// Şirket girişi
router.post('/login', loginLimiter, loginCompany);

// Access Token yenileme
router.post('/refresh-token', refreshAccessToken);

// Şirket çıkışı
router.post('/logout', auth, logoutCompany);

export default router;
