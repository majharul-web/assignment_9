import { Admin, Customer, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { ILogin, ILoginResponse } from './auth.interface';
import { isPasswordMatched } from './auth.utils';

const signUp = async (
  adminData: Customer,
  userData: User
): Promise<Partial<User & Admin> | null> => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.bycrypt_salt_rounds)
  );

  userData.password = hashedPassword;

  const newUser = await prisma.$transaction(async transactionClient => {
    const user = await transactionClient.user.create({
      data: userData,
    });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create user');
    }
    adminData.userId = user.id;
    await transactionClient.customer.create({
      data: adminData,
    });

    return user;
  });

  if (newUser) {
    const responseData = await prisma.customer.findUnique({
      where: {
        email: newUser.email,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create admin');
};

const signIn = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email, password } = payload;

  // check User is exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check password is match
  if (
    isUserExist.password &&
    !(await isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not match');
  }

  // create access token
  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.expires_in,
    }
  );
  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    {
      expiresIn: config.jwt.refresh_expires_in,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  signUp,
  signIn,
};
