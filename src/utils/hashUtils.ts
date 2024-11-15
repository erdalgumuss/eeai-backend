import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};
(async () => {
  const password = "erdal123"; // Girişte kullanılan şifre
  const hashedPassword = "$2a$10$wO2/kN64GUwZ4lBKurdaCeTcxYb0VoP6ujdtjMW/CLiHHMxrvzdAK"; // Veritabanındaki hashlenmiş şifre

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log("Şifre eşleşiyor mu?", isMatch); // true olmalı
})();
