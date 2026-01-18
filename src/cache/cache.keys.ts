export const CACHE_KEYS = {
  barbershop: (id: string) => `barbershop:${id}`,
  barbershops: 'barbershops',

  user: (id: string) => `user:${id}`,
  users: 'users',

  barber: (id: string) => `barber:${id}`,
  barbers: 'barbers',
};
