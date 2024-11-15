import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // OpenAI API anahtarını .env'den al
});

export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.text?.trim() || '';
  } catch (error) {
    console.error('OpenAI API Hatası:', error);
    throw new Error('OpenAI API çağrısı başarısız oldu');
  }
};
