export const customerSearchableFields: string[] = [
  'name',
  'email',
  'contactNo',
  'role',
];

export const customerFilterableFields: string[] = [
  'search',
  ...customerSearchableFields,
];
