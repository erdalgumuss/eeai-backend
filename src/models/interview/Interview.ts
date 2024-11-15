import mongoose, { Document, Schema } from 'mongoose';

// Mülakat arayüzü
export interface IInterview extends Document {
  title: string; // Mülakat başlığı
  type: 'questions_only' | 'personality_and_questions' | 'personality_only'; // Mülakat türü
  questions?: mongoose.Schema.Types.ObjectId[]; // Soruların ID'leri
  personalityInventory?: string; // Kişilik testi ile ilgili açıklama metni
  totalDuration?: number; // Toplam süre (dakika veya saniye olarak)
  createdAt: Date; // Oluşturulma tarihi
  expirationDate: Date; // Pasif olma tarihi
  createdBy: mongoose.Schema.Types.ObjectId; // Admin tarafından oluşturulma
  published: boolean; // Yayında olup olmadığını gösterir
  link: string | null; // Mülakat başvuru linki
  linkExpiration?: Date; // Yayınlanan başvuru linkinin süresi
  aiExpectations?: string; // AI analiz beklentileri için metin
  stages?: {
    personalityTest?: boolean; // Kişilik testi aşaması
    questionnaire?: boolean; // Soru mülakatı aşaması
  };
  status: 'active' | 'completed' | 'inactive'; // Mülakatın durumu
  maxParticipants?: number; // Maksimum katılımcı sayısı
  currentParticipants?: number; // Şu anda katılanların sayısı
  views?: number; // Görüntülenme sayısı
  notes?: string; // İK uzmanı notları
}

const InterviewSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['questions_only', 'personality_and_questions', 'personality_only'],
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    personalityInventory: {
      type: String,
      required: false,
      trim: true,
    },
    totalDuration: {
      type: Number,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    published: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: false,
    },
    linkExpiration: {
      type: Date,
      required: false,
    },
    aiExpectations: {
      type: String,
      required: false,
      trim: true,
    },
    stages: {
      personalityTest: {
        type: Boolean,
        default: false,
      },
      questionnaire: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'inactive'],
      default: 'active',
    },
    maxParticipants: {
      type: Number,
      required: false,
      default: null,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInterview>('Interview', InterviewSchema);
