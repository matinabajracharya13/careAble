import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '@/controllers/userController';
import { getCandidates } from '@/controllers/candidateController';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getCandidates);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
