import bcrypt from 'bcrypt';

export const isPasswordMatched = async (
  givenPassword: string,
  savePassword: string
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, savePassword);
};
