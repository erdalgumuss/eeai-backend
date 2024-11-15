import { Request, Response, NextFunction } from 'express';
import Question from '../../models/interview/Question';
import { generateAIQuestion, suggestQuestions } from '../../services/aiServices/analysisService';


// Yeni soru ekleme
export const addQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit, topic, tags, difficulty, isPublic } = req.body;

  try {
    if (!questionText || !topic) {
      res.status(400).json({ message: 'Soru metni ve konu gereklidir' });
      return;
    }

    const question = new Question({
      questionText,
      timeLimit: timeLimit || 60,
      topic,
      tags,
      difficulty,
      isPublic: isPublic || false,
      creator: req.body.adminId, // Auth middleware'den gelen admin ID
    });

    await question.save();
    res.status(201).json({ message: 'Soru başarıyla eklendi', question });
  } catch (error) {
    next(error);
  }
};

// Soruları listeleme
export const listQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;

    // Sadece public sorular veya oluşturulan sorular listelenecek
    const questions = await Question.find({
      $or: [{ isPublic: true }, { creator: adminId }],
    });

    res.json(questions);
  } catch (error) {
    next(error);
  }
};

// Toplu soru ekleme
export const addMultipleQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const questions = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ message: 'Geçerli bir soru listesi gönderin' });
      return;
    }

    for (const question of questions) {
      if (!question.topic) {
        res.status(400).json({ message: 'Tüm sorularda "topic" alanı zorunludur' });
        return;
      }
      question.creator = req.body.adminId; // Auth middleware'den gelen admin ID
    }

    const createdQuestions = await Question.insertMany(questions);
    res.status(201).json({
      message: 'Sorular başarıyla eklendi',
      createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// Soru güncelleme
export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit, topic, tags, difficulty, isPublic } = req.body;

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Soru bulunamadı' });
      return;
    }

    // Yetki kontrolü
    if (question.creator.toString() !== req.body.adminId) {
      res.status(403).json({ message: 'Bu soruyu güncelleme yetkiniz yok' });
      return;
    }

    // Soruyu güncelle
    question.questionText = questionText || question.questionText;
    question.timeLimit = timeLimit || question.timeLimit;
    question.topic = topic || question.topic;
    question.tags = tags || question.tags;
    question.difficulty = difficulty || question.difficulty;
    question.isPublic = isPublic !== undefined ? isPublic : question.isPublic;

    await question.save();
    res.json({ message: 'Soru güncellendi', question });
  } catch (error) {
    next(error);
  }
};

// Soru silme
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Soru bulunamadı' });
      return;
    }

    // Yetki kontrolü
    if (question.creator.toString() !== req.body.adminId) {
      res.status(403).json({ message: 'Bu soruyu silme yetkiniz yok' });
      return;
    }

    await question.deleteOne();
    res.json({ message: 'Soru silindi' });
  } catch (error) {
    next(error);
  }
};
export const listPublicQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await Question.find({ isPublic: true });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};
export const listOwnQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await Question.find({ creator: req.body.adminId });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};
export const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Soru bulunamadı' });
      return;
    }

    // Public veya kendi oluşturduğu bir soru mu kontrol et
    if (!question.isPublic && question.creator.toString() !== req.body.adminId) {
      res.status(403).json({ message: 'Bu soruya erişim yetkiniz yok' });
      return;
    }

    res.json(question);
  } catch (error) {
    next(error);
  }
};
export const likeQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404).json({ message: 'Soru bulunamadı' });
      return;
    }

    question.likes += 1;
    await question.save();

    res.status(200).json({ message: 'Beğeni başarıyla eklendi', likes: question.likes });
  } catch (error) {
    next(error);
  }
};

// Yapay zeka ile soru oluşturma
export const createAIQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { prompt } = req.body;

  try {
    if (!prompt) {
      res.status(400).json({ message: 'Prompt gereklidir' });
      return;
    }

    const questionText = await generateAIQuestion(prompt);

    res.status(200).json({ message: 'Soru başarıyla oluşturuldu', questionText });
  } catch (error) {
    next(error);
  }
};

// Önerilen soruları listeleme
export const getSuggestedQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { interviewTitle } = req.query;

  try {
    if (!interviewTitle) {
      res.status(400).json({ message: 'Mülakat başlığı gereklidir' });
      return;
    }

    const suggestions = await suggestQuestions(interviewTitle as string);

    res.status(200).json({ message: 'Önerilen sorular', suggestions });
  } catch (error) {
    next(error);
  }
};
