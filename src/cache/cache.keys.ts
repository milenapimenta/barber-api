export const CACHE_KEYS = {
  barbershop: (id: string) => `barbershop:${id}`,
  barbershops: 'barbershops',

  user: (id: string) => `user:${id}`,
  users: 'users',
};
