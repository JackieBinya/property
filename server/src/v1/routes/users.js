import { Router } from 'express';
import { signUpValidator } from '../middleware/inputValidators';
import { verifyNewUser } from '../middleware/verify';
import { createNewUser } from '../controllers/user';

const router = Router();

router.post('/auth/signup', signUpValidator, verifyNewUser, createNewUser);

export default router;
