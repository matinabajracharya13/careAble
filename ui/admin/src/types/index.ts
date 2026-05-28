// ─── Auth ─────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

// ─── Users ────────────────────────────────────────────────────────────────
export type UserStatus = 'active' | 'inactive' | 'pending';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  avatar?: string;
  created_at: string;
  lastActiveAt?: string;
  role_name?: UserRole; // For compatibility with backend response
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  status?: UserStatus;
}

// ─── Pagination ──────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Stats / Dashboard ───────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  growthRate: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ActivityItem {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  action: string;
  target: string;
  createdAt: string;
}

// ─── Theme ──────────────────────────────────────────────────────────────
export type ColorTheme = 'indigo' | 'rose' | 'emerald' | 'amber' | 'cyan';
export type Mode = 'light' | 'dark' | 'system';

export interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface CertificateData {
  valid: boolean;
  certificate_code: string;
  issued_at: number; // timestamp
  assessment_title: string;
  user_name: string;
}

export interface CertificateResponse {
  success: boolean;
  message: string;
  data: CertificateData;
}

export interface Role {
  role_id: string;
  role_name: string;
  description: string;
  icon_key: string;
  label: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
