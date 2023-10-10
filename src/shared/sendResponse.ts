import { Response } from 'express';

type IApiReponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    size: number;
    total: number;
  };
  data?: T | null;
};

type IApiLoginReponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  token?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  };

  res.status(data.statusCode).json(responseData);
};

export const sendLginResponse = <T>(
  res: Response,
  data: IApiLoginReponse<T>
): void => {
  const responseData: IApiLoginReponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || null,
    token: data.token || null || undefined,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
