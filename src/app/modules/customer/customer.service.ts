import { Admin, Customer, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const createCustomer = async (
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

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create customer');
};

export const CustomerService = {
  createCustomer,
};
