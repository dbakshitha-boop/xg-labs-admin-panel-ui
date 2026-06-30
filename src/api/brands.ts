import { createApi } from '../lib/localStore';
import { Brand } from '../types';

export const brandsApi = createApi<Brand>('brands');
