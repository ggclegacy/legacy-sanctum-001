import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  INVITE_SESSION_SECRET: z.string().min(32),
  ATLAS_AUDIO_BUCKET: z.string().min(1).default("atlas-invitations"),
});

const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicSupabaseEnv = z.infer<typeof publicSupabaseEnvSchema>;

export function getServerEnv(): ServerEnv | null {
  const parsed = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    INVITE_SESSION_SECRET: process.env.INVITE_SESSION_SECRET,
    ATLAS_AUDIO_BUCKET: process.env.ATLAS_AUDIO_BUCKET,
  });

  return parsed.success ? parsed.data : null;
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv | null {
  const parsed = publicSupabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  return parsed.success ? parsed.data : null;
}

export function getSiteUrl() {
  const parsed = z.url().safeParse(process.env.NEXT_PUBLIC_SITE_URL);
  return parsed.success ? parsed.data.replace(/\/$/, "") : null;
}

export function isInternalPreviewEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_INTERNAL_PREVIEW === "true"
  );
}
