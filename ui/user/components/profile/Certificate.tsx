import { cn, formatDate, getLevelBadgeClass } from '@/lib/utils';
import { Progress } from '@radix-ui/react-progress';
import { Separator } from '@radix-ui/react-separator';
import { Award, BookOpen, ChevronRight, Eye, Link, Plus, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../ui/toast';
import { Card, CardContent } from '../ui/ui-components';
import { Certificate } from '@/types';
import { useRouter } from 'next/navigation';

interface Props {
  certificates: Certificate[];
  loading: boolean;
}

export function Certificates({ certificates, loading }: Props) {
  const router = useRouter();
  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-display font-semibold text-lg'>Your certificates</h3>
          <p className='text-sm text-muted-foreground'>
            {certificates?.length} certificate{certificates?.length !== 1 ? 's' : ''} earned
          </p>
        </div>

        <Button
          variant='outline'
          size='sm'
          asChild
        >
          <Link href='/assessment'>
            <Plus className='h-4 w-4' />
            Earn more
          </Link>
        </Button>
      </div>

      {/* EMPTY STATE */}
      {certificates?.length === 0 ? (
        <Card>
          <CardContent className='py-16 text-center text-muted-foreground space-y-3'>
            <Award className='h-14 w-14 mx-auto opacity-20' />
            <p className='font-semibold'>No certificates yet</p>
            <p className='text-sm'>Pass an assessment to earn your first certificate.</p>
            <Button asChild>
              <Link href='/assessment'>Browse assessments</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid sm:grid-cols-2 gap-4'>
          {certificates?.map((cert: any) => (
            <Card
              key={cert?.certificate_id}
              className='card-hover overflow-hidden'
            >
              <div className='h-1.5 bg-gradient-to-r from-primary to-accent' />

              <CardContent className='p-6 space-y-4'>
                <div className='flex items-start gap-4'>
                  <div className='h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0'>
                    <Trophy className='h-7 w-7 text-primary' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h4 className='font-display font-semibold text-base leading-tight'>
                      {cert.assessment_title ?? 'Assessment Certificate'}
                    </h4>

                    <div className='flex items-center gap-2 mt-1'>
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize',
                          getLevelBadgeClass(cert.validity_status)
                        )}
                      >
                        {cert.validity_status}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className='grid grid-cols-2 gap-3 text-xs'>
                  <div>
                    <p className='text-muted-foreground'>Issued</p>
                    <p className='font-semibold'>{formatDate(cert.issued_at)}</p>
                  </div>

                  <div>
                    <p className='text-muted-foreground'>Code</p>
                    <p className='font-mono font-semibold text-primary'>{cert.certificate_code}</p>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => router.push(`/certificate/${cert.certificate_code}`)}
                  >
                    View
                  </Button>

                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/certificate/${cert.certificate_code}`);

                      toast({
                        title: 'Link copied!'
                      });
                    }}
                  >
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* RECOMMENDED */}
      {/* <div>
        <h4 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3'>Recommended next</h4>

        <div className='grid sm:grid-cols-2 gap-3'>
          {[
            { title: 'Python Fundamentals', level: 'beginner', category: 'Technology' },
            { title: 'Data Analysis Essentials', level: 'intermediate', category: 'Analytics' }
          ].map((r) => (
            <div
              key={r.title}
              className='flex items-center gap-3 p-4 rounded-xl border border-dashed border-border hover:border-primary/40 transition-colors group'
            >
              <div className='h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors'>
                <BookOpen className='h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors' />
              </div>

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{r.title}</p>
                <p className='text-xs text-muted-foreground capitalize'>
                  {r.level} · {r.category}
                </p>
              </div>

              <Button
                size='sm'
                variant='ghost'
                asChild
                className='shrink-0'
              >
                <Link href='/assessment'>
                  Start <ChevronRight className='h-3.5 w-3.5 ml-1' />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
