import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validations';

const router = express.Router();

router.patch(
  '/:id',

  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);
router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.getSingleUser);

export const UserRoutes = router;
