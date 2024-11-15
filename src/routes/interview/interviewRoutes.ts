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
} from '../../controllers/interview/interviewController';

const router = Router();

// Yeni mülakat oluşturma
router.post('/', auth, createInterview);

// Mülakat güncelleme
router.put('/:id', auth, updateInterview);

// Mülakat silme
router.delete('/:id', auth, deleteInterview);

// Mülakatları listeleme
router.get('/', auth, listInterviews);

// Yayınlama/yayından kaldırma
router.patch('/:id/publish', auth, publishInterview);

// Yalnızca yayınlanmış mülakatları listeleme
router.get('/published', auth, listPublishedInterviews);

// Görüntülenme sayısını artırma
router.post('/:id/views',  incrementViews);

export default router;
