import { Admin, Prisma, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IFilterRequest } from './admin.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import {
  adminRelationalFields,
  adminRelationalFieldsMapper,
  adminSearchableFields,
} from './admin.constant';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createAdmin = async (
  adminData: Admin,
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
    await transactionClient.admin.create({
      data: adminData,
    });

    return user;
  });

  if (newUser) {
    const responseData = await prisma.admin.findUnique({
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

const getAllAdmins = async (
  filterOptions: IFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
  const { searchTerm, ...filterData } = filterOptions;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  console.log({ skip });

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (adminRelationalFields.includes(key)) {
          return {
            [adminRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    where: whereConditions,
    include: {
      user: true,
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

  const total = await prisma.admin.count({
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

const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const updateAdmin = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    include: {
      user: true,
    },
    data: payload,
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  const deletedUser = await prisma.$transaction(async transactionClient => {
    const deleteAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (deleteAdmin.userId) {
      await transactionClient.user.delete({
        where: {
          id: deleteAdmin.userId,
        },
      });
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete admin');
    }

    // if(deleteAdmin.length){

    // }
    return deleteAdmin;
  });

  if (deletedUser) return deletedUser;
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete admin ');
};

export const AdminService = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
