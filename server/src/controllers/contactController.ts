import { createContact, findAllContact } from '@/repositories/contactRepository';
import { Request, Response } from 'express';

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, company, subject, message } = req.body;

    await createContact({
      fullName: name,
      email,
      company,
      subject,
      message
    });

    return res.status(201).json({
      message: 'Contact message submitted successfully',
      success: true
    });
  } catch (err) {
    console.error('Error submitting contact message:', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getContacts = async (_req: Request, res: Response) => {
  try {
    const data = await findAllContact();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
