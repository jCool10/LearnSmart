// Export all auth components for easy importing
export { default as LoginForm } from './LoginForm'
export { default as RegisterForm } from './RegisterForm'
export { default as ForgotPasswordForm } from './ForgotPasswordForm'
export { default as ResetPasswordForm } from './ResetPasswordForm'
export { default as ProtectedRoute } from './ProtectedRoute'

// Re-export types if needed
export type { 
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData
} from '@/lib/validations/auth.validation'