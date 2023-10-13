import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Customer, User } from '@prisma/client';
import { CustomerService } from './customer.service';

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const { email, role, password, ...customerData } = req.body;

  const userInfo = {
    email,
    role,
    password,
  };
  customerData.email = email;
  const result = await CustomerService.createCustomer(
    customerData,
    userInfo as User
  );

  console.log({
    result,
  });

  sendResponse<Partial<User & Customer>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'customer created successfully!',
    data: result,
  });
});

export const CustomerController = {
  createCustomer,
};
