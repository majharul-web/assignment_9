import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CustomerController } from './customer.controller';
import { UserValidation } from '../user/user.validations';
// import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-customer',
  validateRequest(UserValidation.createUserZodSchema),
  CustomerController.createCustomer
);

router.delete('/:id', CustomerController.deleteCustomer);
router.patch('/:id', CustomerController.updateCustomer);
router.get('/', CustomerController.getAllCustomers);

router.get('/:id', CustomerController.getSingleCustomer);
export const CustomerRoutes = router;
