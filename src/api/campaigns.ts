import { createApi } from '../lib/localStore';
import { Campaign } from '../types';

export const campaignsApi = createApi<Campaign>('campaigns');
