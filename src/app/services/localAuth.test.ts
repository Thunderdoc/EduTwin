import { beforeEach, describe, expect, it } from 'vitest';
import { authenticateLocalAccount, createLocalAccount } from './localAuth';

const profile = { id: 'student-1', name: 'Asha', email: 'asha@example.com', role: 'student' as const, createdAt: '2026-01-01T00:00:00.000Z' };

describe('local authentication adapter', () => {
  beforeEach(() => localStorage.clear());

  it('stores a derived password rather than plaintext', async () => {
    await createLocalAccount(profile, 'strong-password');
    const raw = localStorage.getItem('eduflow_offline_users') || '';
    expect(raw).not.toContain('strong-password');
    expect(raw).toContain('passwordHash');
  });

  it('authenticates the correct password and rejects a wrong one', async () => {
    await createLocalAccount(profile, 'strong-password');
    await expect(authenticateLocalAccount('ASHA@example.com', 'strong-password')).resolves.toMatchObject({ id: 'student-1' });
    await expect(authenticateLocalAccount('asha@example.com', 'wrong-password')).resolves.toBeNull();
  });

  it('rejects short passwords', async () => {
    await expect(createLocalAccount(profile, 'short')).rejects.toThrow(/8 characters/);
  });
});
