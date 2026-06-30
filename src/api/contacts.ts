import { createRestApi } from '../lib/apiClient';
import { ContactSubmission } from '../types';

export const contactsApi = createRestApi<ContactSubmission>('contacts');
