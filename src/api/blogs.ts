import { createRestApi } from '../lib/apiClient';
import { BlogPost } from '../types';

const baseApi = createRestApi<BlogPost>('blogs');

export const blogsApi = {
  ...baseApi,

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    const all = await baseApi.getAll();
    return all.find(p => p.slug === slug) || null;
  }
};
