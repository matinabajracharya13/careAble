import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ToastContainer } from "@/components/ui/toast-container";
import { DashboardPage } from "@/pages/dashboard";
import { UsersPage } from "@/pages/users";
import { AnalyticsPage } from "@/pages/analytics";
import { SettingsPage } from "@/pages/settings";
import { NotificationsPage } from "@/pages/notifications";
import { LoginPage } from "@/pages/login";
import { NotFoundPage } from "@/pages/not-found";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
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
                path='/messages'
                element={<MessagesPage />}
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
