import { Request, Response, NextFunction } from 'express';
import * as QuestionService from '../../services/questionService/questionService';

// Yeni soru ekleme
export const addQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit, topic, tags, difficulty, isPublic } = req.body;

  try {
    const question = await QuestionService.createQuestion({
      questionText,
      timeLimit: timeLimit || 60,
      topic,
      tags,
      difficulty,
      isPublic: isPublic || false,
      creator: req.body.adminId,
    });

    res.status(201).json({ message: 'Soru başarıyla eklendi', question });
  } catch (error) {
    next(error);
  }
};


// Soruları listeleme (public + kendi özel soruları)
export const listQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await QuestionService.getAllQuestions(req.body.companyId);
    res.json({ message: 'Sorular başarıyla listelendi', questions });
  } catch (error) {
    next(new Error('Sorular listelenirken hata oluştu.'));
  }
};
// Kendi sorularını listeleme
export const listOwnQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await QuestionService.listOwnQuestions(req.body.companyId);
    res.status(200).json({ message: 'Kendi sorularınız', questions });
  } catch (error) {
    next(error);
  }
};

// Public soruları listeleme
export const listPublicQuestions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await QuestionService.getPublicQuestions();
    res.status(200).json({ message: 'Public sorular', questions });
  } catch (error) {
    next(error);
  }
};

// Soru güncelleme
export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { questionText, timeLimit, topic, tags, difficulty, isPublic } = req.body;

  try {
    const question = await QuestionService.updateQuestion(req.params.id, req.body.adminId, {
      questionText,
      timeLimit,
      topic,
      tags,
      difficulty,
      isPublic,
    });

    res.json({ message: 'Soru güncellendi', question });
  } catch (error) {
    next(error);
  }
};

// Soru silme
export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await QuestionService.deleteQuestion(req.params.id, req.body.adminId);
    res.json({ message: 'Soru silindi' });
  } catch (error) {
    next(error);
  }
};

// Tek bir soru getirme
export const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await QuestionService.getQuestionById(req.params.id, req.body.companyId);

    if (!question) {
      res.status(404).json({ message: 'Soru bulunamadı veya erişim yetkiniz yok.' });
      return;
    }

    res.json(question);
  } catch (error) {
    next(new Error('Soru getirilirken hata oluştu.'));
  }
};

// Soru beğenisi artırma
export const likeQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await QuestionService.likeQuestion(req.params.id);
    res.status(200).json({ message: 'Beğeni başarıyla eklendi', likes: question.likes });
  } catch (error) {
    next(new Error('Beğeni eklenirken hata oluştu.'));
  }
};

// Yapay zeka ile soru oluşturma
export const createAIQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { prompt } = req.body;

  try {
    const questionText = await QuestionService.createAIQuestion(prompt);
    res.status(200).json({ message: 'Yapay zeka ile soru oluşturuldu', questionText });
  } catch (error) {
    next(new Error('Yapay zeka ile soru oluşturulurken hata oluştu.'));
  }
};


// Soruları filtreleme (konu ve başlığa göre)
export const filterQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, topic } = req.query;

  try {
    const questions = await QuestionService.filterQuestions(req.body.companyId, {
      title: title as string,
      topic: topic as string,
    });

    res.status(200).json({ message: 'Filtrelenmiş sorular', questions });
  } catch (error) {
    next(error);
  }
};

// Etiketlere göre filtreleme
export const getQuestionsByTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { tags } = req.query;

  try {
    if (!tags) {
      res.status(400).json({ message: 'Etiketler gereklidir.' });
      return;
    }

    const tagsArray = (tags as string).split(','); // "tag1,tag2,tag3" -> ["tag1", "tag2", "tag3"]
    const questions = await QuestionService.getQuestionsByTags(req.body.companyId, tagsArray);

    res.status(200).json({ message: 'Etiketlere göre filtrelenmiş sorular', questions });
  } catch (error) {
    next(new Error('Etiketlere göre filtrelenmiş sorular getirilirken hata oluştu.'));
  }
};
