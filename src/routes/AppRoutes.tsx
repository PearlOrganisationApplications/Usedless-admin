import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { StudentListPage } from '@/pages/students/StudentListPage';
import { TeacherListPage } from '@/pages/teachers/TeacherListPage';
import { TeacherDetailsPage } from '@/pages/teachers/TeacherDetailsPage';
import { WarRoomPage } from '@/pages/sessions/WarRoomPage';
import { SessionListPage } from '@/pages/sessions/SessionListPage';
import { MatchingLogicPage } from '@/pages/matching/MatchingLogicPage';
import { FinancePage } from '@/pages/finance/FinancePage';
import { StudentWalletPage } from '@/pages/students/StudentWalletPage';
import { MarketingPage } from '@/pages/marketing/MarketingPage';
import { SupportPage } from '@/pages/support/SupportPage';
import { SystemPage } from '@/pages/system/SystemPage';
import { SubscriptionPage } from '@/pages/subscriptions/SubscriptionPage';
import { McqManagementPage } from '@/pages/gamification/McqManagementPage';
import { GamificationPage } from '@/pages/gamification/GamificationPage';
import { LiveClassesPage } from '@/pages/sessions/LiveClassesPage';
import { ReelsManagementPage } from '@/pages/marketing/ReelsManagementPage';
import { ReferralManagementPage } from '@/pages/referral/ReferralManagementPage';
import { AdminManagementPage } from '@/pages/system/AdminManagementPage';
import { RolesPermissionsPage } from '@/pages/system/RolesPermissionsPage';
import { AddTeacherPage } from '@/pages/teachers/AddTeacherPage';
// More imports for modules...

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/2fa" element={<div>2FA Page</div>} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/teachers" element={<TeacherListPage />} />
            <Route path="/teachers/add" element={<AddTeacherPage />} />
            <Route path="/teachers/:id" element={<TeacherDetailsPage />} />
            <Route path="/sessions" element={<SessionListPage />} />
            <Route path="/sessions/live-classes" element={<LiveClassesPage />} />
            <Route path="/matching" element={<MatchingLogicPage />} />
            <Route path="/war-room" element={<WarRoomPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/student-wallets" element={<StudentWalletPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/reels" element={<ReelsManagementPage />} />
            <Route path="/referral" element={<ReferralManagementPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/system/admins" element={<AdminManagementPage />} />
            <Route path="/system/roles" element={<RolesPermissionsPage />} />
            <Route path="/gamification/mcq" element={<McqManagementPage />} />
            <Route path="/system/roles" element={<RolesPermissionsPage />} />
            <Route path="/gamification/mcq" element={<McqManagementPage />} />
            <Route path="/gamification/engagements" element={<GamificationPage />} />
            <Route path="/system" element={<SystemPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
