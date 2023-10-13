export const customerSearchableFields: string[] = [
  'name',
  'email',
  'contactNo',
  'userId',
];

export const customerFilterableFields: string[] = [
  'searchTerm',
  ...customerSearchableFields,
];

export const customerRelationalFields: string[] = ['userId'];
export const customerRelationalFieldsMapper: {
  [key: string]: string;
} = {
  userId: 'user',
};
