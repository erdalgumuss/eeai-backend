import Question from '../../models/interview/Question';
import { generateAIQuestion, suggestQuestions } from '../aiServices/analysisService';

// Yeni soru oluşturma
export const createQuestion = async (data: any): Promise<any> => {
  const question = new Question(data);
  return await question.save();
};

// Soruları listeleme (public + kendi soruları)
export const listQuestions = async (creatorId: string): Promise<any[]> => {
  return await Question.find({
    $or: [{ isPublic: true }, { creator: creatorId }],
  });
};
// Kendi sorularını listeleme
export const listOwnQuestions = async (creatorId: string): Promise<any[]> => {
  return await Question.find({ creator: creatorId });
};

// Public soruları listeleme
export const getPublicQuestions = async (): Promise<any[]> => {
  return await Question.find({ isPublic: true });
};

// Tüm soruları listeleme (public + kendi özel soruları)
export const getAllQuestions = async (companyId: string): Promise<any[]> => {
  return await Question.find({
    $or: [
      { creator: companyId }, // Kullanıcının oluşturduğu sorular
      { isPublic: true }, // Public sorular
    ],
  });
};

// Soru güncelleme
export const updateQuestion = async (id: string, creatorId: string, data: any): Promise<any> => {
  const question = await Question.findById(id);

  if (!question) {
    throw new Error('Soru bulunamadı');
  }

  if (question.creator.toString() !== creatorId) {
    throw new Error('Bu soruyu güncelleme yetkiniz yok');
  }

  Object.assign(question, data);
  return await question.save();
};

// Soru silme
export const deleteQuestion = async (id: string, creatorId: string): Promise<void> => {
  const question = await Question.findById(id);

  if (!question) {
    throw new Error('Soru bulunamadı');
  }

  if (question.creator.toString() !== creatorId) {
    throw new Error('Bu soruyu silme yetkiniz yok');
  }

  await question.deleteOne();
};

// Tek bir soru getirme
export const getQuestionById = async (id: string, creatorId: string): Promise<any> => {
  const question = await Question.findById(id);

  if (!question) {
    throw new Error('Soru bulunamadı');
  }

  if (!question.isPublic && question.creator.toString() !== creatorId) {
    throw new Error('Bu soruya erişim yetkiniz yok');
  }

  return question;
};

// Soru beğenisi artırma
export const likeQuestion = async (id: string): Promise<any> => {
  const question = await Question.findById(id);

  if (!question) {
    throw new Error('Soru bulunamadı');
  }

  question.likes += 1;
  return await question.save();
};

// Yapay zeka ile soru oluşturma
export const createAIQuestion = async (prompt: string): Promise<string> => {
  return await generateAIQuestion(prompt);
};

// Önerilen soruları listeleme
export const getSuggestedQuestions = async (interviewTitle: string): Promise<any[]> => {
  return await suggestQuestions(interviewTitle);
};

// Soruları filtreleme (konu ve başlığa göre)
export const filterQuestions = async (
  companyId: string,
  filters: { title?: string; topic?: string }
): Promise<any[]> => {
  const query: any = {
    $or: [
      { creator: companyId }, // Kullanıcının kendi oluşturduğu sorular
      { isPublic: true }, // Public sorular
    ],
  };

  if (filters.title) {
    query.questionText = { $regex: filters.title, $options: 'i' }; // Başlığa göre arama
  }

  if (filters.topic) {
    query.topic = { $regex: filters.topic, $options: 'i' }; // Konuya göre arama
  }

  return await Question.find(query);
};

// Etiketlere göre soruları listeleme
export const getQuestionsByTags = async (companyId: string, tags: string[]): Promise<any[]> => {
  return await Question.find({
    $or: [
      { creator: companyId }, // Kullanıcının kendi oluşturduğu sorular
      { isPublic: true }, // Public sorular
    ],
    tags: { $in: tags }, // Etiketlere göre filtreleme
  });
};
