'use client';

import { ActivityTab, AssessmentsTab, AvatarUploader, CertificateTab, OverviewTab, PasswordTab } from '@/components/profile';
import { PersonalInfo } from '@/components/profile/PersonalInfo';
import { Badge } from '@/components/ui/ui-components';
import { useAuth } from '@/context/AuthContext';
import { certificateApi, userAssessmentApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AssessmentListItem, Certificate } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Award, BookOpen, Clock, Loader2, Lock, Pencil, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// ── Tab list ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'info', label: 'Personal Info', icon: Pencil },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'assessments', label: 'Assessments', icon: BookOpen }
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const { data: certificates, isLoading: certsLoading } = useQuery({
    queryKey: ['all-certificates'],
    queryFn: certificateApi.getCertificate
  });

  const { data: assessments, isLoading: assesmentsLoading } = useQuery({
    queryKey: ['user-assesments', user?.id],
    queryFn: userAssessmentApi.get
  });

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className='min-h-screen bg-background pt-20 pb-12'>
      <div className='container mx-auto px-4 max-w-5xl'>
        {/* ── Profile header ──────────────────────────────────────────────── */}
        <div className='flex flex-col items-center text-center mb-10 animate-fade-in'>
          <div className='relative mb-4'>
            <AvatarUploader
              name={user.name}
              avatar={user.avatar}
            />
            <div className='absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background' />
          </div>
          <h1 className='text-2xl font-display font-bold'>{user.name}</h1>
          <p className='text-muted-foreground mt-1'>{user.role?.toUpperCase()}</p>
          <div className='flex items-center justify-center gap-2 mt-2 flex-wrap'>
            <Badge className='bg-success/10 text-success border-success/20 text-[10px]'>● Active</Badge>
          </div>
        </div>

        {/* ── Tab layout ──────────────────────────────────────────────────── */}
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar tabs */}
          <aside className='lg:w-52 shrink-0'>
            <nav className='flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0'>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all w-full text-left',
                    activeTab === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className='h-4 w-4 shrink-0' />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Tab content */}
          <div
            className='flex-1 min-w-0 animate-fade-in'
            key={activeTab}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                assessments={[]}
                certificates={certificates as Certificate[]}
                user={user}
              />
            )}
            {activeTab === 'info' && (
              <PersonalInfo
                user={user}
                updateUser={updateUser}
              />
            )}
            {activeTab === 'password' && <PasswordTab />}
            {activeTab === 'certificates' && (
              <CertificateTab
                certificates={certificates as Certificate[]}
                loading={certsLoading}
              />
            )}
            {activeTab === 'assessments' && (
              <AssessmentsTab
                loading={assesmentsLoading}
                assessments={assessments as AssessmentListItem[]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
