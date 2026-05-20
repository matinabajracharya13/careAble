import db from '@/db';

export type CreateContactInput = {
  fullName: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
};

export const createContact = (data: CreateContactInput) => {
  return db('contacts').insert({
    full_name: data.fullName,
    email: data.email,
    company: data.company || null,
    subject: data.subject,
    message: data.message
  });
};

export const findAllContact = () => {
  return db('contacts').select('*').orderBy('created_at', 'desc');
};
