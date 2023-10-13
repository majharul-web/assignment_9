import { Service, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IFilterRequest } from './service.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import {
  serviceRelationalFields,
  serviceRelationalFieldsMapper,
  serviceSearchableFields,
} from './service.constant';
import { paginationHelpers } from '../../../helpers/paginationHelper';

const createService = async (serviceData: Service): Promise<Service | null> => {
  const result = await prisma.service.create({
    data: serviceData,
  });
  return result;
};

const getAllServices = async (
  filterOptions: IFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { searchTerm, ...filterData } = filterOptions;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  console.log({ skip });

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
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
        if (serviceRelationalFields.includes(key)) {
          return {
            [serviceRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    where: whereConditions,

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

  const total = await prisma.service.count({
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

const getSingleService = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateService = async (
  id: string,
  payload: Partial<Service>
): Promise<Service | null> => {
  const result = await prisma.service.update({
    where: {
      id,
    },

    data: payload,
  });
  return result;
};

const deleteService = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.delete({
    where: {
      id,
    },
  });

  return result;
};

export const ServiceService = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
