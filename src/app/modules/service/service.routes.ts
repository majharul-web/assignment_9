import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidation } from './service.validation';
import { ServiceController } from './service.controller';
// import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-service',
  validateRequest(ServiceValidation.createServiceZodSchema),
  ServiceController.createService
);

router.delete('/:id', ServiceController.deleteService);
router.patch('/:id', ServiceController.updateService);
router.get('/', ServiceController.getAllServices);

router.get('/:id', ServiceController.getSingleService);

export const ServiceRoutes = router;
