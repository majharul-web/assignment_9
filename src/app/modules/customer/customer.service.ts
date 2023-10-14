import { Admin, Customer, Prisma, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IFilterRequest } from './customer.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  customerRelationalFields,
  customerRelationalFieldsMapper,
  customerSearchableFields,
} from './customer.constant';

const createCustomer = async (
  customerData: Customer,
  userData: User
): Promise<Partial<User & Admin> | null> => {
  const alreayUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (alreayUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already have an account');
  }
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
    customerData.userId = user.id;
    await transactionClient.customer.create({
      data: customerData,
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

const getAllCustomers = async (
  filterOptions: IFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Customer[]>> => {
  const { searchTerm, ...filterData } = filterOptions;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map(field => ({
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
        if (customerRelationalFields.includes(key)) {
          return {
            [customerRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.CustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
    where: whereConditions,
    include: {
      user: true,
    },
    skip,
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

  const total = await prisma.customer.count({
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

const getSingleCustomer = async (id: string): Promise<Customer | null> => {
  const result = await prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const updateCustomer = async (
  id: string,
  payload: Partial<Customer>
): Promise<Customer | null> => {
  const result = await prisma.customer.update({
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

const deleteCustomer = async (id: string): Promise<Customer | null> => {
  const deletedUser = await prisma.$transaction(async transactionClient => {
    const deleteCustomer = await transactionClient.customer.delete({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (deleteCustomer.userId) {
      await transactionClient.user.delete({
        where: {
          id: deleteCustomer.userId,
        },
      });
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete customer');
    }

    // if(deleteCustomer.length){

    // }
    return deleteCustomer;
  });

  if (deletedUser) return deletedUser;
  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to delete customer ');
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
