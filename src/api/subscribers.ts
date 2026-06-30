import { createRestApi } from '../lib/apiClient';
import { Subscriber } from '../types';

const baseApi = createRestApi<Subscriber>('subscribers');

export const subscribersApi = {
  ...baseApi,

  findByEmail: async (email: string): Promise<Subscriber | null> => {
    const all = await baseApi.getAll();
    return all.find(s => s.email === email) || null;
  }
};
