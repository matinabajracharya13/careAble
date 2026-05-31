'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole } from '@/enums/user-role';
import { useUser } from '@/hooks/use-users';
import { InsightOption } from '@/types';
import { ArrowLeft, Award, Loader2, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserDetailPage() {
  const params = useParams();
  const userId = Number(params.id);
  const navigate = useNavigate();
  const { data, isLoading } = useUser(userId);
  const user = data?.data;
  const getInitials = (name?: string) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='animate-spin' />
      </div>
    );
  }
  if (!user) {
    return (
      <div className='min-h-[70vh] flex items-center justify-center p-6'>
        <Card className='max-w-md w-full'>
          <CardContent className='flex flex-col items-center text-center py-10'>
            <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4'>
              <User className='h-8 w-8 text-muted-foreground' />
            </div>

            <h2 className='text-xl font-semibold'>User not found</h2>

            <p className='text-sm text-muted-foreground mt-2 max-w-sm'>
              The user you're looking for doesn't exist or may have been removed.
            </p>

            <Button
              className='mt-6'
              onClick={() => navigate('/admin/users')}
            >
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className='min-h-screen pt-2 px-2'>
      <div className='max-w-8xl mx-auto space-y-2'>
        {/* BACK */}
        <Button
          variant='ghost'
          onClick={() => navigate('/users')}
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>

        {/* USER HEADER */}
        <Card>
          <CardContent className='p-6 flex items-start gap-4'>
            {/* Avatar */}
            <Avatar className='h-12 w-12'>
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className='space-y-1 flex-1'>
              <h2 className='text-2xl font-bold'>{user?.name}</h2>
              <p className='text-sm text-muted-foreground'>{user?.email}</p>

              <div className='flex flex-wrap gap-2 mt-2'>
                <Badge variant='secondary'>{user?.role}</Badge>
                {user?.role === UserRole.CARER && (
                  <>
                    <Badge variant='outline'>{user?.total_assessments_taken?.length || 0} Assessments</Badge>
                    <Badge variant='outline'>{user?.total_certificates || 0} Certificates</Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {user?.role === UserRole.CARER && (
          <>
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h3 className='font-semibold text-lg'>Candidate Insights</h3>

                {Object.entries(user?.candidate_insights).map(([section, items]) => (
                  <div
                    key={section}
                    className='space-y-2'
                  >
                    <h4 className='text-sm font-semibold capitalize text-muted-foreground'>{items.profile_label}</h4>

                    <div className='flex gap-2 mt-2'>
                      {items.selected_options.map((item: InsightOption) => {
                        return <Badge variant='outline'>{item.label}</Badge>;
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ASSESSMENTS */}
            <Card>
              <CardContent className='p-6 space-y-3'>
                <h3 className='font-semibold text-lg'>Assessments</h3>

                {user?.total_assessments_taken.map((a: any) => (
                  <div
                    key={a.attempt_id}
                    className='flex justify-between items-center border rounded p-3'
                  >
                    <div>
                      <p className='font-medium'>{a.assessment_title}</p>
                      <p className='text-xs text-muted-foreground'>Score: {a.average_score}</p>
                    </div>

                    <Button size='sm'>View</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CERTIFICATES */}
            <Card>
              <CardContent className='p-6 space-y-3'>
                <h3 className='font-semibold text-lg'>Certificates</h3>

                {user?.certificates.map((c: any) => (
                  <div
                    key={c.certificate_code}
                    className='flex justify-between items-center border rounded p-3'
                  >
                    <div>
                      <p className='font-medium'>{c.assessment_title}</p>
                      <p className='text-xs text-muted-foreground'>{c.certificate_code}</p>
                    </div>

                    <Button size='sm'>
                      <Award className='h-4 w-4 mr-2' />
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* COMPETENCY DASHBOARD */}
            <Card>
              <CardContent className='p-6 space-y-4'>
                <h3 className='font-semibold text-lg'>Competency Overview</h3>

                <div className='space-y-4'>
                  {user?.dashboard_stats.map((d: any) => (
                    <div key={d.id}>
                      <div className='flex justify-between text-sm mb-1'>
                        <span>{d.title}</span>
                        <span>{d.score.toFixed(2)}</span>
                      </div>

                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-primary'
                          style={{
                            width: `${(d.score / 5) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
