export const adminRole: string[] = ['admin', 'super_admin'];
export type IFilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  userId?: string | undefined;
};
