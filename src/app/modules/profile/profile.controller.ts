import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProfileService } from './profile.service';
import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const user: JwtPayload | null = req.user;

  let result;

  if (user) {
    result = await ProfileService.myProfile(user.userId);
  }

  sendResponse<Partial<User>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile information retrieved  successfully!',
    data: result,
  });
});

export const ProfileController = {
  myProfile,
};
