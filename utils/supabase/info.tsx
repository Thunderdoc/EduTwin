/* Environment-backed Supabase configuration (no hardcoded secrets in source) */

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
export const isSupabaseConfigured = Boolean(projectId && publicAnonKey);
