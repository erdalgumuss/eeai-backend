import { Router } from 'express';
import auth from '../../middlewares/auth/auth';
import {
  createInterview,
  updateInterview,
  deleteInterview,
  listInterviews,
  publishInterview,
  listPublishedInterviews,
  incrementViews,
  listActiveInterviews,
  listCompletedInterviews,
  listInactiveInterviews,
  updateInterviewStatus,
} from '../../controllers/interview/interviewController';

const router = Router();

// Yeni mülakat oluşturma
router.post('/', auth, createInterview);

// Mülakat güncelleme
router.put('/:id', auth, updateInterview);

// Mülakat silme
router.delete('/:id', auth, deleteInterview);

// Mülakatları listeleme (Kendi Mülakatları)
router.get('/', auth, listInterviews);

// Yayınlama/yayından kaldırma
router.patch('/:id/publish', auth, publishInterview);

// Yalnızca yayınlanmış mülakatları listeleme
router.get('/published', auth, listPublishedInterviews);

// Görüntülenme sayısını artırma
router.post('/:id/views',  incrementViews);
// Aktif mülakatları listeleme
router.get('/active', auth, listActiveInterviews);

// Tamamlanmış mülakatları listeleme
router.get('/completed', auth, listCompletedInterviews);

// Pasif mülakatları listeleme
router.get('/inactive', auth, listInactiveInterviews);

// Mülakat durumunu güncelleme
router.patch('/:id/status', auth, updateInterviewStatus);


export default router;
