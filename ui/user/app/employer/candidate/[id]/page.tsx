'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  Award,
  BookOpen,
  User,
  Brain,
  Loader2,
  ShieldCheck,
  ChartNetwork,
  Briefcase,
  HeartHandshake,
  Languages,
  Sparkles
} from 'lucide-react';

import { Badge, Card, CardContent } from '@/components/ui/ui-components';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { candidatesApi } from '@/lib/api';
import RadarHeatmap from '@/components/heatmap/RadarHeatmap';

type Tab = 'profile' | 'assessments' | 'certificates' | 'insights' | 'heatMap';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'assessments', label: 'Assessments', icon: BookOpen },
  { id: 'heatMap', label: 'Heat Map', icon: ChartNetwork },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'insights', label: 'Insights', icon: Brain }
];

const SECTION_ICONS: Record<string, any> = {
  employment: Briefcase,
  caregiving: HeartHandshake,
  background: Languages,
  about: Sparkles
};

export default function CandidateProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.candidate.detail(id),
    queryFn: () => candidatesApi.getCandidateById(id as string)
  });

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-primary' />
      </div>
    );
  }
  const candidate = data;

  const heatmapData = candidate?.dashboard_stats || [];

  if (!candidate) {
    return <div className='min-h-screen flex items-center justify-center text-muted-foreground'>Candidate not found</div>;
  }

  return (
    <div className='min-h-screen bg-background pt-20 pb-12'>
      <div className='container mx-auto px-4 max-w-5xl space-y-6'>
        {/* HEADER */}
        <Card>
          <CardContent className='p-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg'>
                {candidate.name
                  ?.split(' ')
                  ?.map((n: string) => n[0])
                  ?.join('')}
              </div>

              <div>
                <h1 className='text-xl font-bold'>{candidate.name}</h1>

                <p className='text-sm text-muted-foreground capitalize'>{candidate.role}</p>

                <div className='flex items-center gap-2 mt-1 text-xs text-muted-foreground'>
                  <span>{candidate.postcode}</span>
                  <span>•</span>
                  <span>Joined {formatDate(candidate.created_at)}</span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Badge className='bg-success/10 text-success border-success/20'>Active</Badge>

              <div className='text-right'>
                <p className='text-2xl font-bold'>{candidate.total_assessments_taken?.length || 0}</p>
                <p className='text-xs text-muted-foreground'>Assessments</p>
              </div>

              <Button>Invite</Button>
            </div>
          </CardContent>
        </Card>

        {/* TABS */}
        <div className='flex gap-2 border-b pb-2 overflow-x-auto'>
          {TABS.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors',
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className='space-y-4'>
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <Card>
              <CardContent className='p-6 space-y-4'>
                <div>
                  <h2 className='font-semibold mb-2'>Candidate Overview</h2>

                  <p className='text-sm text-muted-foreground leading-relaxed'>
                    Verified caregiver profile with completed assessments, caregiving experience, and onboarding insights.
                  </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
                  <div className='rounded-xl border p-4'>
                    <p className='text-xs text-muted-foreground mb-1'>Assessments Completed</p>

                    <p className='text-2xl font-bold'>{candidate.total_assessments_taken?.length || 0}</p>
                  </div>

                  <div className='rounded-xl border p-4'>
                    <p className='text-xs text-muted-foreground mb-1'>Certificates Earned</p>

                    <p className='text-2xl font-bold'>{candidate.total_certificates || 0}</p>
                  </div>

                  <div className='rounded-xl border p-4'>
                    <p className='text-xs text-muted-foreground mb-1'>Account Status</p>

                    <p className='text-2xl font-bold'>{candidate.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ASSESSMENTS */}
          {activeTab === 'assessments' && (
            <div className='space-y-3'>
              {candidate.total_assessments_taken?.map((a: any) => (
                <Card key={a.attempt_id}>
                  <CardContent className='p-4'>
                    <div className='flex justify-between gap-4'>
                      <div>
                        <p className='font-semibold'>{a.assessment_title}</p>

                        <p className='text-xs text-muted-foreground mt-1'>{a.assessment_description}</p>

                        <p className='text-xs text-muted-foreground mt-2'>Completed on {formatDate(a.submitted_at)}</p>
                      </div>

                      <div className='text-right shrink-0'>
                        <p className='text-xl font-bold'>{a.average_score}</p>

                        <p className='text-xs text-muted-foreground'>Average Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className='space-y-3'>
              {candidate?.certificates?.map((c: any) => (
                <Card key={c.certificate_code}>
                  <CardContent className='p-4 flex justify-between items-center'>
                    <div>
                      <p className='font-semibold'>{c.assessment_title}</p>

                      <p className='text-xs text-muted-foreground mt-1'>{c.certificate_code}</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Badge className='bg-success/10 text-success border-success/20'>
                        <ShieldCheck className='h-3 w-3 mr-1' />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* HEAT MAP */}
          {activeTab === 'heatMap' && (
            <div>
              {heatmapData.length > 0 ? (
                <RadarHeatmap data={heatmapData} />
              ) : (
                <Card>
                  <CardContent className='p-10 text-center text-muted-foreground'>No heat map data available</CardContent>
                </Card>
              )}
            </div>
          )}

          {/* INSIGHTS */}
          {activeTab === 'insights' && (
            <div className='space-y-6'>
              <Card>
                <CardContent className='p-6 space-y-6'>
                  {Object.entries(candidate.candidate_insights || {}).map(([section, items]: any) => {
                    const Icon = SECTION_ICONS?.[section] || Brain;

                    return (
                      <div
                        key={section}
                        className='space-y-3'
                      >
                        {/* Items Grid */}
                        <div
                          key={items.profile_key}
                          className='rounded-xl border p-4 space-y-2'
                        >
                          {/* Label */}
                          <p className='text-xs text-muted-foreground'>{items.profile_label}</p>

                          {/* Values */}
                          <div className='flex flex-wrap gap-2'>
                            {items?.selected_options.map((v: any) => (
                              <Badge
                                key={v.id}
                                variant='secondary'
                              >
                                {v.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
