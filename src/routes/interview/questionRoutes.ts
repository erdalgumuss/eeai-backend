import express from 'express';
import auth from '../../middlewares/auth/auth';
import {
  addQuestion,
  listQuestions,
  addMultipleQuestions,
  updateQuestion,
  deleteQuestion,
  listPublicQuestions,
  getQuestionById,
  likeQuestion,
  listOwnQuestions,
  createAIQuestion,
  getSuggestedQuestions,
} from '../../controllers/interview/questionController';

const router = express.Router();

// Yeni soru ekleme
router.post('/add', auth, addQuestion);

// Tüm soruları listeleme (public + kendi soruları)
router.get('/list', auth, listQuestions);

// Public soruları listeleme
router.get('/list-public', listPublicQuestions);

// Kendi sorularını listeleme
router.get('/list-own', auth, listOwnQuestions);

// Toplu soru ekleme
router.post('/add-multiple', auth, addMultipleQuestions);

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
router.get('/suggest', auth, getSuggestedQuestions);


export default router;
