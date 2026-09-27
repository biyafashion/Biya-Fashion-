/**
 * BIYA FASHION - Admin Authentication Configuration
 * 
 * IMPORTANT SECURITY NOTE:
 * Frontend-only authentication. Hardcoded credentials are NOT secure for production.
 * A real production application requires server-side authentication, salted hashing,
 * and secure HTTP-only cookies / JWT tokens.
 */

export const ADMIN_CONFIG = {
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "Biya@2026",
  SESSION_STORAGE_KEY: "biya_admin_session",
  SESSION_EXPIRY_HOURS: 24,
};

export default ADMIN_CONFIG;
