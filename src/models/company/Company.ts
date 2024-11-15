import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICompany extends Document {
  companyName: string; // Şirket adı
  email: string; // Şirket için e-posta
  password: string; // Hesap parolası
  isActive: boolean; // Hesap aktif mi
  comparePassword(candidatePassword: string): Promise<boolean>; // Parola karşılaştırma
}

const CompanySchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true, // Her şirketin adı benzersiz olmalı
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Lütfen geçerli bir e-posta adresi giriniz',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt otomatik olarak eklenir
  }
);

// Parolayı hashleme
CompanySchema.pre<ICompany>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Parola karşılaştırma
CompanySchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<ICompany>('Company', CompanySchema);
