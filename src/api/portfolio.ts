import { createApi } from '../lib/localStore';
import { Portfolio } from '../types';

export const portfoliosApi = createApi<Portfolio>('portfolios');
