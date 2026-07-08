export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  role: string;
  expiresAt: string;
  permissions: string[];
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken: string;
  expiresAt: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  tokenVersion: number;
  profileId: number | null;
  firstName: string | null;
  lastName: string | null;
  documentType: string | null;
  documentNumber: string | null;
  phoneNumber: string | null;
}

export interface RoleResponse {
  role: string;
  permissions: string[];
}

export interface ProfileResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  firstName: string | null;
  lastName: string | null;
  documentType: string | null;
  documentNumber: string | null;
  phoneNumber: string | null;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  phoneNumber?: string | null;
}

export interface CreateUserRequest extends RegisterRequest {
  role?: string;
  enabled?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  enabled?: boolean;
  firstName?: string;
  lastName?: string;
  documentType?: string;
  documentNumber?: string;
  phoneNumber?: string | null;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  documentType?: string;
  documentNumber?: string;
  phoneNumber?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface LogoutRequest {
  refreshToken?: string | null;
}
