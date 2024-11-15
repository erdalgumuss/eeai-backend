import mongoose, { Document, Schema, Types } from 'mongoose';

// Soru arayüzü
export interface IQuestion extends Document {
  questionText: string; // Soru metni
  timeLimit: number; // Soru için ayrılan süre (saniye)
  topic: string; // Konu
  tags: string[]; // Etiketler
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // Zorluk seviyesi
  isPublic: boolean; // Herkese açık mı
  likes: number; // Beğeni sayısı
  usageCount: number; // Kaç kez kullanıldığı
  creator: Types.ObjectId; // Soruyu oluşturan kullanıcının ID'si
}

const QuestionSchema: Schema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    timeLimit: {
      type: Number,
      required: false,
      default: 60, // Varsayılan süre 60 saniye
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String], // Birden fazla etiket alabilir
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'], // Zorluk seviyeleri
      default: 'beginner',
    },
    isPublic: {
      type: Boolean,
      default: false, // Varsayılan olarak sadece oluşturucu görebilir
    },
    likes: {
      type: Number,
      default: 0, // Varsayılan beğeni sayısı
    },
    usageCount: {
      type: Number,
      default: 0, // Varsayılan kullanım sayısı
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId, // Kullanıcı modeline referans
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını ekler
  }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
