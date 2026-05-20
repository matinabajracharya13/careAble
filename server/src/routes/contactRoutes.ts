import { getAllMessages } from '@/controllers/admin/contactController';
import { sendContactMessage, getContacts } from '@/controllers/contactController';
import { requireAdmin } from '@/middleware/admin';
import { authenticate } from '@/middleware/authenticate';
import { Router } from 'express';

const router = Router();

router.post('/', sendContactMessage);
router.get('/', authenticate, requireAdmin, getAllMessages);

export default router;
