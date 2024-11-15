import { Request, Response, NextFunction } from 'express';
import * as InterviewService from '../../services/interviewService/interviewService';

// Yeni mülakat oluşturma
export const createInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, questions, expirationDate, type, personalityInventory, aiExpectations, maxParticipants, stages } = req.body;

  try {
    const interview = await InterviewService.createInterview({
      title,
      questions,
      expirationDate,
      createdBy: req.body.companyId, // Token'dan alınan şirket ID'si
      type,
      personalityInventory,
      aiExpectations,
      maxParticipants,
      stages,
    });

    res.status(201).json({ message: 'Mülakat başarıyla oluşturuldu', interview });
  } catch (error) {
    next(error);
  }
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, questions, expirationDate, type, personalityInventory, aiExpectations, maxParticipants, stages } = req.body;

  try {
    const interview = await InterviewService.updateInterview(req.params.id, req.body.companyId, {
      title,
      questions,
      expirationDate,
      type,
      personalityInventory,
      aiExpectations,
      maxParticipants,
      stages,
    });

    res.json({ message: 'Mülakat güncellendi', interview });
  } catch (error) {
    next(error);
  }
};

// Mülakat silme
export const deleteInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await InterviewService.deleteInterview(req.params.id, req.body.companyId);
    res.json({ message: 'Mülakat silindi' });
  } catch (error) {
    next(error);
  }
};

// Kendi mülakatlarını listeleme
export const listInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.listInterviews(req.body.companyId);
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// Yayınlama/yayından kaldırma
export const publishInterview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { published } = req.body;

  try {
    const interview = await InterviewService.publishInterview(req.params.id, req.body.companyId, published);
    res.json({
      message: `Mülakat ${published ? 'yayınlandı' : 'yayından kaldırıldı'}`,
      interview,
    });
  } catch (error) {
    next(error);
  }
};

// Yalnızca yayınlanmış mülakatları listeleme
export const listPublishedInterviews = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.listPublishedInterviews();
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};
// Aktif mülakatları listeleme
export const listActiveInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.getInterviewsByStatus('active', req.body.companyId);
    res.status(200).json({ message: 'Aktif mülakatlar', interviews });
  } catch (error) {
    next(error);
  }
};

// Tamamlanmış mülakatları listeleme
export const listCompletedInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.getInterviewsByStatus('completed', req.body.companyId);
    res.status(200).json({ message: 'Tamamlanmış mülakatlar', interviews });
  } catch (error) {
    next(error);
  }
};

// Pasif mülakatları listeleme
export const listInactiveInterviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interviews = await InterviewService.getInterviewsByStatus('inactive', req.body.companyId);
    res.status(200).json({ message: 'Pasif mülakatlar', interviews });
  } catch (error) {
    next(error);
  }
};

// Mülakat durumunu güncelleme
export const updateInterviewStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { status } = req.body;

  if (!['active', 'completed', 'inactive'].includes(status)) {
    res.status(400).json({ message: 'Geçersiz durum değeri' });
    return;
  }

  try {
    const interview = await InterviewService.updateInterviewStatus(req.params.id, req.body.companyId, status);
    res.status(200).json({ message: 'Mülakat durumu güncellendi', interview });
  } catch (error) {
    next(error);
  }
};


// Görüntülenme sayısını artırma
export const incrementViews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const interview = await InterviewService.incrementViews(req.params.id);
    res.json({ message: 'Görüntülenme sayısı artırıldı', views: interview.views });
  } catch (error) {
    next(error);
  }
};
