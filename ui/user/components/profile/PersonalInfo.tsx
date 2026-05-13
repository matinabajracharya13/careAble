// ── Personal info tab ─────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Briefcase, MapPin, Phone, Globe, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Textarea } from '../ui/ui-components';
import z from 'zod';
import { Input } from '../ui/input';

const infoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
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
      name: user.name,
      email: user.email,
      jobTitle: user.jobTitle ?? '',
      location: '',
      phone: '',
      website: '',
      bio: '',
      skills: (user.skills ?? []).join(', ')
    }
  });

  const bio = watch('bio') ?? '';

  const onSubmit = async (data: InfoFormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({
      name: data.name,
      email: data.email,
      jobTitle: data.jobTitle,
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
                Full name <span className='text-destructive'>*</span>
              </label>
              <Input
                placeholder='Jane Smith'
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
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
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Job title</label>
              <Input
                placeholder='e.g. Software Engineer'
                icon={<Briefcase className='h-4 w-4' />}
                {...register('jobTitle')}
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Location</label>
              <Input
                placeholder='e.g. Sydney, NSW'
                icon={<MapPin className='h-4 w-4' />}
                {...register('location')}
              />
            </div>
          </div>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Phone number</label>
              <Input
                type='tel'
                placeholder='+61 4xx xxx xxx'
                icon={<Phone className='h-4 w-4' />}
                {...register('phone')}
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-sm font-medium'>Website / LinkedIn</label>
              <Input
                placeholder='https://linkedin.com/in/...'
                icon={<Globe className='h-4 w-4' />}
                {...register('website')}
                error={errors.website?.message}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>About you</CardTitle>
          <CardDescription>A short bio shown on your public profile.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium'>Bio</label>
              <span className={cn('text-xs', bio.length > 280 ? 'text-destructive' : 'text-muted-foreground')}>{bio.length}/300</span>
            </div>
            <Textarea
              placeholder="Tell employers about yourself, your experience, and what you're looking for..."
              rows={4}
              {...register('bio')}
              error={errors.bio?.message}
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium'>Skills</label>
            <Input
              placeholder='JavaScript, React, Python, SQL, ...'
              {...register('skills')}
            />
            <p className='text-xs text-muted-foreground'>Separate skills with commas.</p>
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
