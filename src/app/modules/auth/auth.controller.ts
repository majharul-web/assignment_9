import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { Customer, User } from '@prisma/client';
import config from '../../../config';
import { ILoginResponse } from './auth.interface';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const { email, role, password, ...adminData } = req.body;

  const userInfo = {
    email,
    role,
    password,
  };
  adminData.email = email;
  const result = await AuthService.signUp(adminData, userInfo as User);

  console.log({
    result,
  });

  sendResponse<Partial<User & Customer>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin created successfully!',
    data: result,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const loginData = req.body;

  const result = await AuthService.signIn(loginData);

  const { refreshToken, ...others } = result;

  // set refresh token in cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    data: others,
  });
});

export const AuthController = {
  signUp,
  signIn,
};
