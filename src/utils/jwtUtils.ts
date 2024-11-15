import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  companyName: string;
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

export const verifyToken = (token: string): Payload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret') as Payload;
  } catch (error) {
    throw new Error('Geçersiz token');
  }
};
