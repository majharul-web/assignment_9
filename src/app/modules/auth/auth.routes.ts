import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validations';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.signUp
);

router.post(
  '/signin',
  validateRequest(AuthValidation.userLoginZodSchema),
  AuthController.signIn
);

export const AuthRoutes = router;
