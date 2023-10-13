export const adminSearchableFields: string[] = [
  'name',
  'email',
  'contactNo',
  'userId',
];

export const adminFilterableFields: string[] = [
  'searchTerm',
  ...adminSearchableFields,
];

export const adminRelationalFields: string[] = ['userId'];
export const adminRelationalFieldsMapper: {
  [key: string]: string;
} = {
  userId: 'user',
};
