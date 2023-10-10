import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const myProfile = async (userId: string): Promise<Partial<User> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return result;
};

export const ProfileService = {
  myProfile,
};
