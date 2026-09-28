/**
 * Authentication configuration for Campus Lost & Found.
 * You can restrict sign-ups and logins to institutional campus email domains.
 * Set to null or '' to allow any valid email.
 */
export const AUTH_CONFIG = {
  // Example: '@mycollege.edu' or '@campus.edu' or '' (blank allows all email domains)
  ALLOWED_CAMPUS_DOMAIN: import.meta.env.VITE_CAMPUS_EMAIL_DOMAIN || '',
  
  // App branding display
  APP_NAME: 'Campus Lost & Found',
  APP_TAGLINE: "Lost something? Found something? Let's connect.",
};

export const isAllowedEmailDomain = (email: string): boolean => {
  const domain = AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN.trim().toLowerCase();
  if (!domain) return true;
  return email.trim().toLowerCase().endsWith(domain.startsWith('@') ? domain : `@${domain}`);
};
