// =============================================================================
// Environment Variable Validation
// Validated at module initialization time. If any required variable is missing
// or malformed, the application fails fast with a descriptive error message
// rather than silently using undefined values at runtime.
//
// Usage: import "@/lib/env" at the top of src/app/layout.tsx to validate
// on every cold start.
// =============================================================================

import { z } from "zod";

const envSchema = z.object({
  // Supabase — required in production, optional locally (falls back to static data)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g. https://xxx.supabase.co)")
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required when using Supabase")
    .optional(),

  // WhatsApp — optional, falls back to default in config.ts
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(
      /^91\d{10}$/,
      "NEXT_PUBLIC_WHATSAPP_NUMBER must be in format 91XXXXXXXXXX (e.g. 919347487107)"
    )
    .optional(),

  // Site URL — optional, falls back to localhost
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .optional(),

  // Admin (server-side only — never exposed to client)
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
    .optional(),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.format();
    const messages = Object.entries(formatted)
      .filter(([key]) => key !== "_errors")
      .map(([key, value]) => {
        const errors = (value as { _errors?: string[] })?._errors ?? [];
        return errors.map((err) => `  ✗ ${key}: ${err}`).join("\n");
      })
      .filter(Boolean)
      .join("\n");

    throw new Error(
      `\n\n❌ Invalid environment variables:\n${messages}\n\nCheck your .env.local file. See .env.example for all required variables.\n`
    );
  }

  return parsed.data;
}

// Validate immediately when this module loads.
// In a server context this happens at cold start — misconfiguration is caught early.
export const env = validateEnv();

// ---------------------------------------------------------------------------
// Supabase availability helper — used by services to decide whether to
// query Supabase or fall back to static seed data.
// ---------------------------------------------------------------------------
export const isSupabaseConfigured =
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
