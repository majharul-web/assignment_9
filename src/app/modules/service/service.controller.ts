import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Service } from '@prisma/client';
import { ServiceService } from './service.service';
import pick from '../../../shared/pick';
import { serviceFilterableFields } from './service.constant';

const createService = catchAsync(async (req: Request, res: Response) => {
  const serviceData = req.body;

  const result = await ServiceService.createService(serviceData);

  sendResponse<Service>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'service created successfully!',
    data: result,
  });
});

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, serviceFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ServiceService.getAllServices(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.getSingleService(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ServiceService.updateService(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.deleteService(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});
export const ServiceController = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};
