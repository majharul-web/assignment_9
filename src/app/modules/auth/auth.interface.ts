import { User } from '@prisma/client';

export type ILogin = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  accessToken: string;
  user?: Partial<User | null>;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
