import { Request, Response, NextFunction } from 'express';
import * as CompanyService from '../../services/companyService/companyService';
import { generateToken } from '../../utils/jwtUtils';

// Şirket oluşturma
export const registerCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { companyName, email, password } = req.body;

  try {
    const token = await CompanyService.createCompany({ companyName, email, password });

    res.status(201).json({ token, message: 'Şirket kaydı başarıyla tamamlandı' });
  } catch (error) {
    console.error('Şirket oluşturma hatası:', error);
    next(error);
  }
};

// Şirket girişi
export const loginCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const company = await CompanyService.authenticateCompany(email, password);

    const token = generateToken({
      id: company.id,
      companyName: company.companyName,
    });

    res.status(200).json({ token, message: 'Başarılı giriş' });
  } catch (error) {
    console.error('Şirket girişi hatası:', error);
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
