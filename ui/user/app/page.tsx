'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Badge, Card, CardContent, Separator, Textarea } from '@/components/ui/ui-components';
import { contactApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { ContactFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronRight,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Send,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ── Validation ────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  subject: z.string().min(4, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters')
});

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Professionals Certified', value: '12,400+', icon: Award },
  { label: 'Partner Companies', value: '340+', icon: Building2 },
  { label: 'Skill Assessments', value: '85+', icon: Target },
  { label: 'Success Rate', value: '94%', icon: TrendingUp }
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Skill Validation',
    description: 'Complete scientifically designed assessments in minutes. Get objective proof of your competencies that employers trust.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    description:
      'Each certificate carries a unique verification code. Employers can verify authenticity in seconds with our public registry.',
    color: 'text-accent',
    bg: 'bg-accent/10'
  },
  {
    icon: Shield,
    title: 'Trusted by Enterprise',
    description: '340+ companies from startups to Fortune 500 use CareAble to screen candidates and upskill their workforce.',
    color: 'text-success',
    bg: 'bg-success/10'
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Employers get deep insights into candidate skill gaps. Professionals see exactly where to improve.',
    color: 'text-warning',
    bg: 'bg-warning/10'
  },
  {
    icon: Globe,
    title: 'Industry-Aligned',
    description: 'Assessments crafted in partnership with industry leaders to reflect real-world skills and current market demand.',
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    icon: Users,
    title: 'Dual-Sided Platform',
    description: "Whether you're seeking talent or growing your career, CareAble has a tailored experience for you.",
    color: 'text-accent',
    bg: 'bg-accent/10'
  }
];

const PARTNERS = [
  { name: 'TechCorp', tier: 'platinum' },
  { name: 'InnovateCo', tier: 'platinum' },
  { name: 'DataFlow', tier: 'gold' },
  { name: 'CloudSync', tier: 'gold' },
  { name: 'BuildRight', tier: 'gold' },
  { name: 'Nexus AI', tier: 'silver' },
  { name: 'Vertex Labs', tier: 'silver' },
  { name: 'BlueWave', tier: 'silver' }
];

const TESTIMONIALS = [
  {
    name: 'Amelia Carter',
    role: 'Frontend Developer',
    company: 'Freelance',
    text: 'My CareAble JavaScript certificate landed me three interviews in a week. Employers immediately understood my level.',
    rating: 5
  },
  {
    name: 'Marcus Lee',
    role: 'Talent Acquisition Lead',
    company: 'TechCorp',
    text: 'We reduced time-to-hire by 40% by using CareAble assessments as a first screening step. The quality of candidates improved dramatically.',
    rating: 5
  },
  {
    name: 'Priya Nair',
    role: 'Data Analyst',
    company: 'DataFlow',
    text: "I used CareAble to identify my skill gaps and then prove I'd filled them. My salary increased 22% after certification.",
    rating: 5
  }
];

// ── Animated counter ──────────────────────────────────────────────────────────
function StatCard({ stat }: { stat: (typeof STATS)[0] }) {
  const Icon = stat.icon;
  return (
    <div className='text-center space-y-1'>
      <div className='inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 mb-2 mx-auto'>
        <Icon className='h-5 w-5 text-primary' />
      </div>
      <div className='text-3xl font-display font-bold text-foreground'>{stat.value}</div>
      <div className='text-sm text-muted-foreground'>{stat.label}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [contactLoading, setContactLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onContactSubmit = async (data: ContactFormData) => {
    setContactLoading(true);
    try {
      await contactApi.submit(data);
      toast({ variant: 'success', title: 'Message sent!', description: "We'll get back to you within 24 hours." });
      reset();
    } catch {
      toast({ variant: 'destructive', title: 'Failed to send', description: 'Please try again.' });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
        {/* Background mesh */}
        <div className='absolute inset-0 bg-mesh-gradient pointer-events-none' />
        <div className='absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl' />
        <div className='absolute bottom-1/4 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl' />

        {/* Grid pattern */}
        <div
          className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className='container mx-auto px-4 py-20 relative z-10'>
          <div className='max-w-4xl mx-auto text-center space-y-8 animate-fade-in'>
            <h1 className='text-5xl md:text-7xl font-display font-bold text-foreground leading-tight tracking-tight text-balance'>
              Every <span className='gradient-text italic'>Carer</span>
              <br />
              Deserves to be <span className='gradient-text italic'>Seen</span>
            </h1>

            <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
              A platform recognising the skills of Australia's hidden caregiving workforce and connecting them to the support and
              opportunities they deserve.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Button
                size='xl'
                variant='outline'
                asChild
              >
                <Link href='/login'>Login to your account</Link>
              </Button>
            </div>

            <div className='flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground'>
              {['No credit card', 'Free assessments', 'Instant results'].map((item) => (
                <div
                  key={item}
                  className='flex items-center gap-1.5'
                >
                  <CheckCircle className='h-4 w-4 text-success' />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero cards floating visual */}
          <div className='mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto'>
            {[
              { icon: GraduationCap, label: 'For Carers', desc: 'Prove your skills, earn certificates, land jobs' },
              { icon: Briefcase, label: 'For Carer Seekers', desc: 'Hire with confidence using verified assessments' },
              { icon: Award, label: 'Recognised Skilled Categories', desc: '85+ assessments across tech, management & more' }
            ].map((card, i) => (
              <div
                key={card.label}
                className={cn(
                  'glass rounded-xl p-4 text-center space-y-2 card-hover animate-fade-in',
                  i === 1 && 'border-primary/30 bg-primary/5'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl mx-auto',
                    i === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}
                >
                  <card.icon className='h-5 w-5' />
                </div>
                <p className='text-xs font-semibold'>{card.label}</p>
                <p className='text-[11px] text-muted-foreground leading-tight'>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className='py-16 border-y border-border bg-secondary/30'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {STATS.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Purpose / How it Works ─────────────────────────────────────────── */}
      <section className='py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16 space-y-4'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>How it works</Badge>
            <h2 className='text-4xl md:text-5xl font-display font-bold tracking-tight'>
              Simple. Trusted. <span className='gradient-text italic'>Powerful.</span>
            </h2>
            <p className='text-muted-foreground max-w-xl mx-auto'>
              CareAble is a two-sided platform that makes hiring and career growth evidence-based — not based on gut feelings.
            </p>
          </div>

          {/* Two paths */}
          <div className='grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto'>
            {[
              {
                icon: GraduationCap,
                title: 'For Carer Seekers',
                color: 'primary',
                steps: [
                  'Create your profile & complete onboarding',
                  'Take skill assessments in your field',
                  'Earn verified certificates on success',
                  'Share certificates & get discovered'
                ]
              },
              {
                icon: Briefcase,
                title: 'For Employers',
                color: 'accent',
                steps: [
                  'Set up your company profile',
                  'Browse verified candidate profiles',
                  'Send targeted assessments to applicants',
                  'Hire with skill confidence'
                ]
              }
            ].map((path) => (
              <Card
                key={path.title}
                className='card-hover'
              >
                <CardContent className='p-8 space-y-5'>
                  <div className={cn('inline-flex h-12 w-12 items-center justify-center rounded-xl', `bg-${path.color}/10`)}>
                    <path.icon className={cn('h-6 w-6', `text-${path.color}`)} />
                  </div>
                  <h3 className='text-xl font-display font-semibold'>{path.title}</h3>
                  <ul className='space-y-3'>
                    {path.steps.map((step, i) => (
                      <li
                        key={step}
                        className='flex items-start gap-3 text-sm text-muted-foreground'
                      >
                        <span
                          className={cn(
                            'flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5',
                            `bg-${path.color}`
                          )}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={path.color === 'primary' ? 'default' : 'outline'}
                    className='w-full group'
                    asChild
                  >
                    <Link href='/signup'>
                      Get started <ChevronRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {FEATURES.map((f, i) => (
              <Card
                key={f.title}
                className={cn('card-hover animate-fade-in')}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <CardContent className='p-6 space-y-3'>
                  <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', f.bg)}>
                    <f.icon className={cn('h-5 w-5', f.color)} />
                  </div>
                  <h3 className='font-display font-semibold'>{f.title}</h3>
                  <p className='text-sm text-muted-foreground leading-relaxed'>{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ──────────────────────────────────────────────────────── */}
      <section className='py-20 bg-secondary/30 border-y border-border'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12 space-y-3'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>Our partners</Badge>
            <h2 className='text-3xl font-display font-bold'>Trusted by industry leaders</h2>
            <p className='text-muted-foreground'>These organisations use CareAble to build stronger teams.</p>
          </div>

          {/* Platinum */}
          <div className='mb-8'>
            <p className='text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Platinum Partners</p>
            <div className='flex flex-wrap justify-center gap-4'>
              {PARTNERS.filter((p) => p.tier === 'platinum').map((p) => (
                <div
                  key={p.name}
                  className='flex items-center justify-center h-16 px-8 rounded-xl border border-primary/20 bg-primary/5 min-w-[160px]'
                >
                  <span className='font-display font-bold text-xl text-primary'>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gold */}
          <div className='mb-8'>
            <p className='text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Gold Partners</p>
            <div className='flex flex-wrap justify-center gap-3'>
              {PARTNERS.filter((p) => p.tier === 'gold').map((p) => (
                <div
                  key={p.name}
                  className='flex items-center justify-center h-14 px-6 rounded-xl border border-warning/20 bg-warning/5 min-w-[140px]'
                >
                  <span className='font-display font-semibold text-lg text-warning'>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Silver */}
          <div>
            <p className='text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Silver Partners</p>
            <div className='flex flex-wrap justify-center gap-3'>
              {PARTNERS.filter((p) => p.tier === 'silver').map((p) => (
                <div
                  key={p.name}
                  className='flex items-center justify-center h-12 px-5 rounded-xl border border-border bg-card min-w-[120px]'
                >
                  <span className='font-medium text-muted-foreground'>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className='py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12 space-y-3'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>Testimonials</Badge>
            <h2 className='text-3xl font-display font-bold'>What people are saying</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
            {TESTIMONIALS.map((t, i) => (
              <Card
                key={t.name}
                className={cn('card-hover animate-fade-in')}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className='p-6 space-y-4'>
                  <div className='flex gap-0.5'>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className='h-4 w-4 fill-warning text-warning'
                      />
                    ))}
                  </div>
                  <p className='text-sm text-muted-foreground leading-relaxed italic'>"{t.text}"</p>
                  <div className='flex items-center gap-3'>
                    <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm'>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className='text-sm font-semibold'>{t.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section
        id='contact'
        className='py-24 bg-secondary/30 border-t border-border'
      >
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            <div className='text-center mb-12 space-y-3'>
              <Badge className='bg-primary/10 text-primary border-primary/20'>Contact us</Badge>
              <h2 className='text-4xl font-display font-bold'>Get in touch</h2>
              <p className='text-muted-foreground'>Have questions? We'd love to hear from you.</p>
            </div>

            <div className='grid md:grid-cols-5 gap-10'>
              {/* Info */}
              <div className='md:col-span-2 space-y-6'>
                <div>
                  <h3 className='font-display font-semibold text-lg mb-4'>Contact information</h3>
                  <div className='space-y-4 text-sm text-muted-foreground'>
                    {[
                      { icon: Mail, text: 'hello@CareAble.dev' },
                      { icon: Phone, text: '+61 2 0000 0000' },
                      { icon: MapPin, text: 'Sydney, NSW, Australia' }
                    ].map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className='flex items-center gap-3'
                      >
                        <div className='h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                          <Icon className='h-4 w-4 text-primary' />
                        </div>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className='text-sm font-semibold mb-3'>Demo credentials</p>
                  <div className='space-y-2 text-xs font-mono bg-card border border-border rounded-lg p-3'>
                    <p className='text-muted-foreground'>Career account:</p>
                    <p>career@demo.com / demo123</p>
                    <p className='text-muted-foreground mt-2'>Employer account:</p>
                    <p>employer@demo.com / demo123</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <Card className='md:col-span-3'>
                <CardContent className='p-8'>
                  <form
                    onSubmit={handleSubmit(onContactSubmit)}
                    className='space-y-5'
                  >
                    <div className='grid sm:grid-cols-2 gap-4'>
                      <div className='space-y-1.5'>
                        <label className='text-sm font-medium'>Full name *</label>
                        <Input
                          placeholder='Jane Smith'
                          {...register('name')}
                          error={errors.name?.message}
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <label className='text-sm font-medium'>Email *</label>
                        <Input
                          type='email'
                          placeholder='jane@company.com'
                          {...register('email')}
                          error={errors.email?.message}
                        />
                      </div>
                    </div>
                    <div className='grid sm:grid-cols-2 gap-4'>
                      <div className='space-y-1.5'>
                        <label className='text-sm font-medium'>Company</label>
                        <Input
                          placeholder='Acme Corp (optional)'
                          {...register('company')}
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <label className='text-sm font-medium'>Subject *</label>
                        <Input
                          placeholder='Partnership enquiry'
                          {...register('subject')}
                          error={errors.subject?.message}
                        />
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <label className='text-sm font-medium'>Message *</label>
                      <Textarea
                        placeholder='Tell us how we can help...'
                        rows={5}
                        {...register('message')}
                        error={errors.message?.message}
                      />
                    </div>
                    <Button
                      type='submit'
                      loading={contactLoading}
                      className='w-full'
                      size='lg'
                    >
                      <Send className='h-4 w-4' />
                      Send message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className='py-10 border-t border-border'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <div className='h-6 w-6 rounded flex items-center justify-center'>
                <Image
                  src='/logo.png'
                  alt='Logo'
                  width={32}
                  height={32}
                />              </div>
              <span className='font-display font-semibold text-foreground'>CareAble</span>
              <span>© 2026</span>
            </div>
            <div className='flex gap-6'>
              {['Privacy', 'Terms', 'About', 'Blog'].map((l) => (
                <a
                  key={l}
                  href='#'
                  className='hover:text-primary transition-colors'
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
