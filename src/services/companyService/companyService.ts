import Company from '../../models/company/Company';
import { hashPassword, comparePassword } from '../../utils/hashUtils';
import { generateToken } from '../../utils/jwtUtils';

export const createCompany = async (data: {
  companyName: string;
  email: string;
  password: string;
}): Promise<string> => {
  // Şirketin benzersiz olduğunu kontrol et
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    throw new Error('Bu e-posta adresi zaten kullanılmakta');
  }

  // Şifreyi hashle
  const hashedPassword = await hashPassword(data.password);

  // Yeni şirket oluştur
  const newCompany = new Company({
    ...data,
    password: hashedPassword,
  });

  await newCompany.save();

  // JWT Token oluştur
  return generateToken({
    id: newCompany.id,
    companyName: newCompany.companyName,
  });
};

export const authenticateCompany = async (email: string, password: string): Promise<any> => {
  // Şirketi email ile bul
  const company = await Company.findOne({ email });
  if (!company) {
    throw new Error('Geçersiz e-posta veya şifre');
  }

  if (!company.isActive) {
    throw new Error('Hesap devre dışı bırakılmış');
  }

  // Şifre kontrolü
  const isMatch = await comparePassword(password, company.password);
  if (!isMatch) {
    throw new Error('Geçersiz e-posta veya şifre');
  }

  return company;
};
