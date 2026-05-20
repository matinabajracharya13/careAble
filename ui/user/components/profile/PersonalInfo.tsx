// ── Personal info tab ─────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Briefcase, MapPin, Phone, Globe, Save, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Textarea } from '../ui/ui-components';
import z from 'zod';
import { Input } from '../ui/input';

const infoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().readonly(),
  role: z.string().readonly(),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  skills: z.string().optional()
});

type InfoFormData = z.infer<typeof infoSchema>;

export function PersonalInfo({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email,
      role: user.role ?? '',
      postcode: user.postcode ?? '',
      phone: user.phone,
      bio: '',
      date_of_birth: user.date_of_birth ?? '',
      skills: (user.skills ?? []).join(', ')
    }
  });

  const bio = watch('bio') ?? '';

  const onSubmit = async (data: InfoFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      postcode: data.postcode,
      phone: data.phone,
      bio: data.bio,
      skills: data.skills
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    });
    toast({ variant: 'success', title: 'Profile updated!', description: 'Your information has been saved.' });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6'
    >
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Basic information</CardTitle>
          <CardDescription>Your name and contact details visible to employers.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>
                First name <span className='text-destructive'>*</span>
              </label>
              <Input
                placeholder='Jane'
                {...register('first_name')}
                error={errors.first_name?.message}
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>
                Last name <span className='text-destructive'>*</span>
              </label>
              <Input
                placeholder='Smith'
                {...register('last_name')}
                error={errors.last_name?.message}
              />
            </div>
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>
                Email address <span className='text-destructive'>*</span>
              </label>
              <Input
                type='email'
                placeholder='jane@example.com'
                icon={<Mail className='h-4 w-4' />}
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Phone number</label>
              <Input
                type='tel'
                placeholder='+61 4xx xxx xxx'
                icon={<Phone className='h-4 w-4' />}
                {...register('phone')}
              />
            </div>
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Postal Code</label>
              <Input
                placeholder='e.g. Sydney, NSW'
                icon={<MapPin className='h-4 w-4' />}
                {...register('postcode')}
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Date of Birth</label>
              <Input
                type='date'
                placeholder='YYYY-MM-DD'
                icon={<Calendar className='h-4 w-4' />}
                {...register('date_of_birth')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          type='submit'
          loading={loading}
          disabled={!isDirty}
        >
          <Save className='h-4 w-4' />
          Save changes
        </Button>
      </div>
    </form>
  );
}
