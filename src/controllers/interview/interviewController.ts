import { Request, Response, NextFunction } from 'express';
import * as InterviewService from '../../services/companyService/interviewService';

// Yeni mülakat oluşturma
export const createInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, questions, expirationDate, type, personalityInventory, aiExpectations, maxParticipants } = req.body;

  try {
    const interview = await InterviewService.createInterview({
      title,
      questions,
      expirationDate,
      createdBy: req.body.adminId,
      type,
      personalityInventory,
      aiExpectations,
      maxParticipants,
    });

    res.status(201).json({ message: 'Mülakat başarıyla oluşturuldu', interview });
  } catch (error) {
    next(error);
  }
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, questions, expirationDate, type, personalityInventory, aiExpectations, maxParticipants } = req.body;

  try {
    const interview = await InterviewService.updateInterview(req.params.id, {
      title,
      questions,
      expirationDate,
      type,
      personalityInventory,
      aiExpectations,
      maxParticipants,
    });

    res.json({ message: 'Mülakat güncellendi', interview });
  } catch (error) {
    next(error);
  }
};

// Mülakat silme
export const deleteInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await InterviewService.deleteInterview(req.params.id, req.body.adminId);
    res.json({ message: 'Mülakat silindi' });
  } catch (error) {
    next(error);
  }
};

// Mülakatları listeleme
export const listInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.listInterviews(req.body.adminId);
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// Yayınlama/yayından kaldırma
export const publishInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { published } = req.body;

  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5174';
    const interview = await InterviewService.publishInterview(req.params.id, published, baseUrl);

    res.json({
      message: `Mülakat ${published ? 'yayınlandı' : 'yayından kaldırıldı'}`,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// Yalnızca yayınlanmış mülakatları listeleme
export const listPublishedInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.listPublishedInterviews();
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// Görüntülenme sayısını artırma
export const incrementViews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await InterviewService.incrementViews(req.params.id);
    res.json({ message: 'Görüntülenme sayısı artırıldı' });
  } catch (error) {
    next(error);
  }
};
