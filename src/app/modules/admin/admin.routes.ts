import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';
// import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

router.delete('/:id', AdminController.deleteAdmin);
router.patch('/:id', AdminController.updateAdmin);
router.get('/', AdminController.getAllAdmins);

router.get('/:id', AdminController.getSingleAdmin);

export const AdminRoutes = router;
