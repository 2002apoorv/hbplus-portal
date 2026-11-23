/**
 * Domain Validation Utility for HBPLUS Employee Portal
 * 
 * Strict authorization rules:
 * - Only emails ending with the exact domain '@hbplus.fit' are permitted.
 * - Validation is case-insensitive.
 * - Malformed addresses, subdomain spoofing, and lookalike domains are rejected.
 */

export const AUTHORIZED_DOMAIN = 'hbplus.fit';
export const AUTHORIZED_DOMAIN_SUFFIX = `@${AUTHORIZED_DOMAIN}`;

/**
 * Validates whether an email belongs strictly to the authorized company domain (@hbplus.fit).
 * 
 * @param {string|null|undefined} email - The email address to validate.
 * @returns {{ isValid: boolean, error: string | null, normalizedEmail: string | null }}
 */
export function validateEmailDomain(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email address is required.',
      normalizedEmail: null,
    };
  }

  const trimmed = email.trim().toLowerCase();

  // Basic format check
  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      error: 'Invalid email address format.',
      normalizedEmail: trimmed,
    };
  }

  // Split strictly on '@'
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Malformed email address.',
      normalizedEmail: trimmed,
    };
  }

  const [localPart, domain] = parts;

  // Local part cannot be empty
  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'Email username cannot be empty.',
      normalizedEmail: trimmed,
    };
  }

  // Domain must match exactly hbplus.fit (no subdomains, no extra extensions)
  if (domain !== AUTHORIZED_DOMAIN) {
    return {
      isValid: false,
      error: `Access restricted. Please login using your official domain email (${AUTHORIZED_DOMAIN_SUFFIX}).`,
      normalizedEmail: trimmed,
    };
  }

  return {
    isValid: true,
    error: null,
    normalizedEmail: trimmed,
  };
}

/**
 * Convenience boolean check for domain authorization.
 * 
 * @param {string|null|undefined} email 
 * @returns {boolean} True if email is strictly @hbplus.fit
 */
export function isAuthorizedEmail(email) {
  return validateEmailDomain(email).isValid;
}

export default {
  AUTHORIZED_DOMAIN,
  AUTHORIZED_DOMAIN_SUFFIX,
  validateEmailDomain,
  isAuthorizedEmail,
};
