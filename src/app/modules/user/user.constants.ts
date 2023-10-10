export const userSearchableFields: string[] = [
  'name',
  'email',
  'contactNo',
  'role',
];

export const userFilterableFields: string[] = [
  'search',
  ...userSearchableFields,
];
