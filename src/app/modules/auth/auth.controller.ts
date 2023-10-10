import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse, { sendLginResponse } from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import config from '../../../config';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await AuthService.signUp(userData);

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
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

  sendLginResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    token: others.accessToken,
  });
});
export const AuthController = {
  signUp,
  signIn,
};
