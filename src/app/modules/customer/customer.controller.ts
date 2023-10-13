import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Customer, User } from '@prisma/client';
import { CustomerService } from './customer.service';
import pick from '../../../shared/pick';
import { customerFilterableFields } from './customer.constant';

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

const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await CustomerService.getAllCustomers(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CustomerService.getSingleCustomer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer fetched successfully',
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CustomerService.updateCustomer(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer updated successfully',
    data: result,
  });
});
const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CustomerService.deleteCustomer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer deleted successfully',
    data: result,
  });
});

export const CustomerController = {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
