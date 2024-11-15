import express from 'express';
import auth from '../../middlewares/auth/auth';
import {
  addQuestion,
  listQuestions,
  listOwnQuestions,
  listPublicQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
  likeQuestion,
  createAIQuestion,
  //getSuggestedQuestions,
  filterQuestions,
  getQuestionsByTags,
} from '../../controllers/interview/questionController';

const router = express.Router();

// Yeni soru ekleme
router.post('/add', auth, addQuestion);

// Tüm soruları listeleme (public + kendi soruları)
router.get('/list', auth, listQuestions);

// Kendi sorularını listeleme
router.get('/list-own', auth, listOwnQuestions);

// Public soruları listeleme
router.get('/list-public', listPublicQuestions);

// Soru güncelleme
router.put('/update/:id', auth, updateQuestion);

// Soru silme
router.delete('/delete/:id', auth, deleteQuestion);

// Tek bir soru getirme
router.get('/:id', auth, getQuestionById);

// Beğeni ekleme
router.post('/like/:id', auth, likeQuestion);

// Yapay zeka ile soru oluşturma
router.post('/generate-ai', auth, createAIQuestion);

// Önerilen soruları listeleme
//router.get('/suggest', auth, getSuggestedQuestions);

// Soruları filtreleme (konu ve başlığa göre)
router.get('/filter', auth, filterQuestions);

// Etiketlere göre soruları listeleme
router.get('/tags', auth, getQuestionsByTags);

export default router;
