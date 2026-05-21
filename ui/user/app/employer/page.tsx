'use client';

import { RoleGuard } from '@/components/auth/RouteGuard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { UserRole } from '@/config/role';
import { candidatesApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Award, ChevronRight, Mail, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? 'text-success' : score >= 75 ? 'text-warning' : 'text-destructive';
  return <div className={cn('text-2xl font-display font-bold', color)}>{score}</div>;
}

export default function EmployerPage() {
  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => candidatesApi.getAllCandidates()
  });

  const handleContact = (name: string) => {
    toast({
      variant: 'success',
      title: `Invitation sent to ${name}!`,
      description: "They'll receive an email to complete your assessment."
    });
  };

  return (
    <RoleGuard allowedRoles={[UserRole.EMPLOYER]}>
      <div className='min-h-screen bg-background pt-20 pb-12'>
        <div className='container mx-auto px-4 max-w-6xl'>
          {/* Header */}
          <div className='mb-8 space-y-2 animate-fade-in'>
            <Badge className='bg-primary/10 text-primary border-primary/20'>
              <Users className='h-3.5 w-3.5 mr-1' />
              Talent pool
            </Badge>
            <h1 className='text-4xl font-display font-bold'>Verified talent, ready to hire</h1>
            <p className='text-muted-foreground'>
              Browse candidates with verified skill certificates. Filter by skill, score, or availability.
            </p>
          </div>

          {/* Stats bar */}
          <div className='grid grid-cols-3 gap-4 mb-8'>
            {[
              { label: 'Active candidates', value: candidates?.filter((c) => c.available).length, icon: Users },
              {
                label: 'Avg. skill score',
                value: `${Math.round((candidates?.reduce((a, c) => a + c.score, 0) || 0) / (candidates?.length || 1))}`,
                icon: TrendingUp
              },
              { label: 'Certificates held', value: candidates?.reduce((a, c) => a + c.certs.length, 0), icon: Award }
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className='p-4 flex items-center gap-3'>
                  <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                    <s.icon className='h-4 w-4 text-primary' />
                  </div>
                  <div>
                    <p className='text-xl font-display font-bold'>{s.value}</p>
                    <p className='text-xs text-muted-foreground'>{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Candidate grid */}
          <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {candidates?.map((candidate, i) => (
              <Card
                key={candidate.id}
                className={cn('card-hover animate-fade-in')}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <CardContent className='p-6 space-y-4'>
                  {/* Top */}
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-sm shrink-0'>
                        {candidate.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className='font-semibold text-sm'>{candidate.name}</p>
                        <p className='text-xs text-muted-foreground'>{candidate.title}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <ScoreRing score={candidate.score} />
                      <p className='text-[10px] text-muted-foreground'>avg. score</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                    <span>{candidate.location}</span>
                    <span>·</span>
                    <span>{candidate.experience} exp.</span>
                    <span
                      className={cn(
                        'ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        candidate.available ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {candidate.available ? '● Available' : '○ Passive'}
                    </span>
                  </div>

                  {/* Certificates */}
                  <div>
                    <p className='text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1'>
                      <Award className='h-3 w-3' /> Certificates
                    </p>
                    <div className='flex flex-wrap gap-1.5'>
                      {candidate.certs.map((cert) => (
                        <span
                          key={cert}
                          className='text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-medium'
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 pt-1 border-t border-border'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex-1'
                      onClick={() => handleContact(candidate.name)}
                    >
                      <Mail className='h-3.5 w-3.5' />
                      Invite
                    </Button>
                    <Button
                      size='sm'
                      className='flex-1'
                    >
                      View profile
                      <ChevronRight className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {candidates?.length === 0 && (
            <div className='text-center py-20 text-muted-foreground'>
              <Users className='h-12 w-12 mx-auto mb-3 opacity-20' />
              <p className='font-semibold'>No candidates found</p>
              <p className='text-sm mt-1'>Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
