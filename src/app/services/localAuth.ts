import type { UserProfile } from '../context/AppContext';

export interface LocalAccount extends UserProfile {
  passwordHash: string;
  passwordSalt: string;
  password?: never;
  verified: boolean;
}

type LegacyAccount = UserProfile & { password: string; passwordHash?: string; passwordSalt?: string; verified?: boolean };
const STORAGE_KEY = 'eduflow_offline_users';
const encoder = new TextEncoder();

export function readAccounts(): Array<LocalAccount | LegacyAccount> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((value) => { binary += String.fromCharCode(value); });
  return btoa(binary);
}

async function derivePassword(password: string, saltBase64: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = Uint8Array.from(atob(saltBase64), (character) => character.charCodeAt(0));
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 210_000 }, key, 256);
  return bytesToBase64(new Uint8Array(bits));
}

export async function createLocalAccount(profile: UserProfile, password: string): Promise<LocalAccount> {
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordSalt = bytesToBase64(salt);
  const account: LocalAccount = { ...profile, passwordSalt, passwordHash: await derivePassword(password, passwordSalt), verified: true };
  const accounts = readAccounts().filter((item) => item.email.toLowerCase() !== profile.email.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...accounts, account]));
  return account;
}

export async function authenticateLocalAccount(email: string, password: string): Promise<UserProfile | null> {
  const accounts = readAccounts();
  const index = accounts.findIndex((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  if (index < 0) return null;
  const account = accounts[index];
  let valid = false;
  if ('passwordHash' in account && account.passwordHash && account.passwordSalt) {
    valid = (await derivePassword(password, account.passwordSalt)) === account.passwordHash;
  } else if ('password' in account) {
    valid = account.password === password;
    if (valid) {
      const { password: _removed, ...profile } = account;
      accounts[index] = await createLocalAccount(profile, password);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  }
  if (!valid) return null;
  const { passwordHash: _hash, passwordSalt: _salt, password: _password, verified: _verified, ...profile } = accounts[index] as LocalAccount & { password?: string };
  return profile;
}
