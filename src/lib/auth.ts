// Facade: the implementation lives in src/server/auth and src/server/services.
export type { CurrentAdmin, CurrentAdminProfile } from "@/server/auth/types";
export { hashPassword, verifyPassword } from "@/server/auth/password";
export {
  validateAdminIdentity,
  validateAdminInput,
} from "@/server/auth/validation";
export {
  isAuthenticated,
  login,
  logout,
  requireAuth,
} from "@/server/auth/session";
export { getAdminCount } from "@/server/services/admin-accounts";
export {
  beginAdminEmailVerification,
  beginAdminPasswordResetVerification,
  beginCurrentAdminPasswordChange,
  completeCurrentAdminPasswordChange,
  verifyAdminEmail,
  verifyAdminPasswordReset,
} from "@/server/services/admin-verification";
