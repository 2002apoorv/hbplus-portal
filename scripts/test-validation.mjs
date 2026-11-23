import { validateEmailDomain, isAuthorizedEmail, AUTHORIZED_DOMAIN } from '../src/utils/validateDomain.js';

const testCases = [
  // Authorized cases
  { email: 'john@hbplus.fit', expected: true, label: 'Standard employee email' },
  { email: 'employee@hbplus.fit', expected: true, label: 'Generic employee email' },
  { email: 'ADMIN@HBPLUS.FIT', expected: true, label: 'Uppercase email' },
  { email: 'first.last@hbplus.fit', expected: true, label: 'Dotted username' },
  { email: 'user+tag@hbplus.fit', expected: true, label: 'Plus addressed username' },
  { email: '  spaces@hbplus.fit   ', expected: true, label: 'Trimmed email with spaces' },

  // Unauthorized domains
  { email: 'john@gmail.com', expected: false, label: 'Standard Gmail account' },
  { email: 'john@yahoo.com', expected: false, label: 'Yahoo account' },
  { email: 'john@outlook.com', expected: false, label: 'Outlook account' },
  { email: 'john@company.com', expected: false, label: 'Other company domain' },

  // Spoofing and bypass attempts
  { email: 'hbplus.fit@gmail.com', expected: false, label: 'Domain name in local part with gmail domain' },
  { email: 'john@hbplus.fit.example.com', expected: false, label: 'Subdomain spoofing with .example.com' },
  { email: 'john@hbplus.fit.attacker.org', expected: false, label: 'Attacker host spoofing' },
  { email: 'john@fakehbplus.fit', expected: false, label: 'Prefix lookalike domain' },
  { email: 'john@hbplus.fit.io', expected: false, label: 'Different TLD' },
  { email: 'john@sub.hbplus.fit', expected: false, label: 'Subdomain of hbplus.fit' },
  { email: 'john@hbplus.fitness', expected: false, label: 'Longer TLD lookalike' },
  { email: 'john@@hbplus.fit', expected: false, label: 'Double @' },
  { email: 'john@hbplus.fit@evil.com', expected: false, label: 'Nested @' },
  { email: '@hbplus.fit', expected: false, label: 'Empty local part' },
  { email: 'john@', expected: false, label: 'Missing domain' },
  { email: '', expected: false, label: 'Empty string' },
  { email: null, expected: false, label: 'Null input' },
  { email: undefined, expected: false, label: 'Undefined input' },
];

let passed = 0;
let failed = 0;

console.log(`Running Domain Validation Tests for @${AUTHORIZED_DOMAIN}...\n`);

testCases.forEach(({ email, expected, label }, index) => {
  const result = isAuthorizedEmail(email);
  const details = validateEmailDomain(email);
  const status = result === expected ? '✅ PASS' : '❌ FAIL';

  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`FAILURE [Case #${index + 1} - ${label}]: Email "${email}" expected ${expected} but got ${result}`);
  }
  console.log(`${status} [Case #${index + 1}]: "${email}" -> ${result ? 'AUTHORIZED' : 'DENIED'} (${label})`);
  if (!result && details.error) {
    console.log(`    Reason: ${details.error}`);
  }
});

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} total cases.`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All domain validation tests passed successfully!');
}
