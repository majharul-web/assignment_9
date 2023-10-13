import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { orderSearchableFields } from './order.constants';
import { IOrderFilterRequest, reqUser } from './order.interface';
import { Order, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ENUM_USER_ROLE } from '../../../enums/user';

const createOrder = async (data: any): Promise<Order> => {
  const result = await prisma.order.create({
    data: data,
    include: {
      user: true,
    },
  });
  return result;
};

const getAllOrders = async (
  filterOptions: IOrderFilterRequest,
  paginationOptions: IPaginationOptions,
  user: reqUser
): Promise<IGenericResponse<Order[]>> => {
  const { search, ...filtersData } = filterOptions;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (user.role === ENUM_USER_ROLE.CUSTOMER) {
    andConditions.push({
      AND: [{ userId: user.userId }],
    });
  }
  if (search) {
    andConditions.push({
      OR: orderSearchableFields.map(field => ({
        [field]: { contains: search, mode: 'insensitive' },
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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    include: {
      user: true,
    },
    where: whereConditions,
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
  const total = await prisma.order.count({
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

const getSingleOrder = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const deleteOrder = async (id: string): Promise<Order | null> => {
  const result = await prisma.order.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  deleteOrder,
};
