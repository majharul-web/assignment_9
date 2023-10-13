export const serviceSearchableFields: string[] = ['title', 'price', 'location'];

export const serviceFilterableFields: string[] = [
  'searchTerm',
  ...serviceSearchableFields,
];

export const serviceRelationalFields: string[] = ['userId'];
export const serviceRelationalFieldsMapper: {
  [key: string]: string;
} = {
  userId: 'user',
};
