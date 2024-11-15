import { Request, Response, NextFunction } from 'express';
import * as CompanyService from '../../services/authService/authService';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwtUtils';


// Şirket oluşturma
export const registerAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { companyName, email, password } = req.body;

  try {
    // Veri doğrulama
    if (!companyName || !email || !password) {
      res.status(400).json({ message: 'Tüm alanlar zorunludur' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Şifre en az 8 karakter olmalıdır' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: 'Geçersiz e-posta formatı' });
      return;
    }

    // Şirket oluştur ve token üret
    const token = await CompanyService.createCompany({ companyName, email, password });

    res.status(201).json({ token, message: 'Şirket kaydı başarıyla tamamlandı' });
  } catch (error: any) {
    console.error('Şirket oluşturma hatası:', error.message);

    if (error.message.includes('E11000')) {
      // MongoDB benzersizlik hatası
      res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılmakta' });
    } else {
      res.status(500).json({ message: 'Şirket kaydı sırasında bir hata oluştu' });
    }

    next(error);
  }
};

export const loginCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Girdi doğrulama
    if (!email || !password) {
      res.status(400).json({ message: 'E-posta ve şifre zorunludur' });
      return;
    }

    // Şirket kimlik doğrulama
    const company = await CompanyService.authenticateCompany(email, password);

    // JWT Token oluşturma
    const token = generateToken({
      id: company.id,
      companyName: company.companyName,
    });

    res.status(200).json({ token, message: 'Başarılı giriş' });
  } catch (error: any) {
    console.error('Şirket girişi hatası:', error.message);

    // Hata yönetimi
    if (error.message === 'Geçersiz e-posta veya şifre') {
      res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    } else {
      res.status(500).json({ message: 'Sunucu hatası' });
    }

    next(error);
  }
};


// Şirket çıkışı
export const logoutCompany = async (req: Request, res: Response): Promise<void> => {
  // Opsiyonel: Token invalidation (ör. Redis kullanımı)
  try {
    res.status(200).json({ message: 'Başarılı çıkış' });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh Token eksik' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    // Yeni Access Token oluştur
    const accessToken = generateToken({
      id: decoded.id,
      companyName: decoded.companyName,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};
