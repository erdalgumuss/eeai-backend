import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwtUtils';

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Erişim reddedildi, token yok veya hatalı format'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.body.companyId = decoded.id; // Şirket ID'si istek gövdesine eklenir
    req.body.companyName = decoded.companyName; // Şirket adı eklenir
    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Geçersiz token'));
  }
};

export default auth;
