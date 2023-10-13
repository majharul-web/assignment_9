import { User, Prisma, userRole } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constants';
import { IUserFilterRequest } from './user.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getAllUsers = async (
  filterOptions: IUserFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<(User[] | any) | null>> => {
  const { searchTerm, ...filtersData } = filterOptions;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      email: true,
      role: true,
      Admin: true,
      Customer: true,
      createdAt: true,
      updatedAt: true,
    },
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<(User | any) | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      Admin: true,
      Customer: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<User | null> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUser = async (id: string): Promise<User | null> => {
  const deletedUser = await prisma.$transaction(async transactionClient => {
    let result;
    const existingUser = await transactionClient.user.findUnique({
      where: {
        id,
      },
      include: {
        Admin: true,
        Customer: true,
      },
    });

    console.log({ existingUser });

    if (existingUser) {
      const role = existingUser.role;
      let isDelete;
      if (role === userRole.super_admin) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'super admin can not deleted'
        );
      } else if (role === userRole.admin) {
        isDelete = await transactionClient.admin.delete({
          where: {
            id: existingUser.Admin[0].id,
          },
        });
      } else {
        isDelete = await transactionClient.customer.delete({
          where: {
            id: existingUser.Customer[0].id,
          },
        });
      }

      if (isDelete) {
        result = await prisma.user.delete({
          where: {
            id,
          },
        });
      }
    }

    return result;
  });

  if (deletedUser) return deletedUser;
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete user ');
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
