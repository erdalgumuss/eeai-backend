import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  companyName: string;
}

// Access Token oluşturma
export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Access Token süresi
  });
};

// Refresh Token oluşturma
export const generateRefreshToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Refresh Token süresi
  });
};

// Token doğrulama
export const verifyToken = (token: string): Payload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as Payload;
  } catch (error) {
    throw new Error('Geçersiz token');
  }
};

// Refresh Token doğrulama
export const verifyRefreshToken = (token: string): Payload => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret') as Payload;
  } catch (error) {
    throw new Error('Geçersiz Refresh Token');
  }
};
