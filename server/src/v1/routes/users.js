import { Router } from 'express';
import { signUpValidator, loginValidator } from '../middleware/inputValidators';
import { verifyNewUser, verifyExistingUser } from '../middleware/verify';
import { createNewUser, authUser } from '../controllers/user';

const router = Router();

router.post('/auth/signup', signUpValidator, verifyNewUser, createNewUser);
router.post('/auth/signin', loginValidator, verifyExistingUser, authUser);

export default router;
