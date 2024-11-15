import Question from '../../models/interview/Question';
import { generateAIResponse } from './openAIService';

export const generateAIQuestion = async (prompt: string): Promise<string> => {
  // OpenAI servisine prompt gönderilir
  return await generateAIQuestion(prompt);
};

export const suggestQuestions = async (interviewTitle: string): Promise<any[]> => {
  try {
    // Tagler ve başlık ile ilişkili soruları bulur
    const questions = await Question.find({
      $or: [
        { interviewTitle: { $regex: interviewTitle, $options: 'i' } },
        { tags: { $in: [interviewTitle] } },
      ],
    }).limit(10);

    return questions;
  } catch (error) {
    console.error('Soru önerisi oluşturulurken hata:', error);
    throw new Error('Öneri oluşturma sırasında bir hata oluştu');
  }
};
