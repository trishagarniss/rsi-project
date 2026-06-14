import { post } from '@/lib/api-client';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  async send(data: ContactData) {
    return await post('/contact', data);
  },
};
