import { Router } from 'express';
import { registerCompany, loginCompany, logoutCompany } from '../../controllers/company/companyController';

const router = Router();

// Şirket kaydı
router.post('/register', registerCompany);

// Şirket girişi
router.post('/login', loginCompany);

// Şirket çıkışı
router.post('/logout', logoutCompany);

export default router;
