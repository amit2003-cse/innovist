// Admin Authentication & Whitelist Configuration

export const ADMIN_EMAILS = [
  "abhishek1973kr@gmail.com",
  "amit4321sg@gmail.com",
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  role: "superadmin" | "admin";
}

/**
 * Checks if the provided email is authorized to access the Admin Panel.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(normalized);
}
