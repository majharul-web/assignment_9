import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Admin, User } from '@prisma/client';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email, role, password, ...adminData } = req.body;

  const userInfo = {
    email,
    role,
    password,
  };
  adminData.email = email;
  const result = await AdminService.createAdmin(adminData, userInfo as User);

  console.log({
    result,
  });

  sendResponse<Partial<User & Admin>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin created successfully!',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
};
