import { ProtectedRoute } from '@/components/auth/protected-route';
import { AppLayout } from '@/components/layout/app-layout';
import { ToastContainer } from '@/components/ui/toast-container';
import { queryClient } from '@/lib/query-client';
import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { NotificationsPage } from '@/pages/notifications';
import { SettingsPage } from '@/pages/settings';
import { UsersPage } from '@/pages/users';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AnalyticsPage from './pages/analytics';
import { AssessmentBuilderPage } from './pages/assessment-builder';
import { AssessmentsPage } from './pages/assessments';
import { MessagesPage } from './pages/messages';
import { OnboardingPage } from './pages/onboarding';
import { RolesPage } from './pages/roles';
import UserDetailPage from './pages/user-details';
import { VerifyCertificatePage } from './pages/verify-certificate';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route
            path='/login'
            element={<LoginPage />}
          />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path='/'
                element={<DashboardPage />}
              />
              <Route
                path='/users'
                element={<UsersPage />}
              />
              <Route
                path='/users/:id'
                element={<UserDetailPage />}
              />
              <Route
                path='/messages'
                element={<MessagesPage />}
              />
              <Route
                path='/onboarding'
                element={<OnboardingPage />}
              />
              <Route
                path='/assessments'
                element={<AssessmentsPage />}
              />
              <Route
                path='/assessments/:assessmentId'
                element={<AssessmentBuilderPage />}
              />
              <Route
                path='/roles'
                element={<RolesPage />}
              />
              <Route
                path='/verify-certificate'
                element={<VerifyCertificatePage />}
              />
              <Route
                path='/analytics'
                element={<AnalyticsPage />}
              />
              <Route
                path='/notifications'
                element={<NotificationsPage />}
              />
              <Route
                path='/settings'
                element={<SettingsPage />}
              />
            </Route>
          </Route>

          {/* Fallback */}
          <Route
            path='*'
            element={
              <Navigate
                to='/'
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
