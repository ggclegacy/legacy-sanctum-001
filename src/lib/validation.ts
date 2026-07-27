import { z } from "zod";

export const inviteTokenSchema = z
  .string()
  .trim()
  .min(20)
  .max(160)
  .regex(/^[A-Za-z0-9_-]+$/);

export const invitePinSchema = z
  .string()
  .trim()
  .regex(/^\d{4,6}$/);

export const verifyInviteSchema = z.object({
  token: inviteTokenSchema,
  pin: invitePinSchema,
});

export const responseSchema = z.object({
  responseType: z.enum([
    "accepted",
    "feedback",
    "conversation_requested",
    "product_recipient_only",
  ]),
  message: z.string().trim().max(2000).optional().default(""),
  preferredContactMethod: z
    .enum(["email", "phone", "either", "none"])
    .optional()
    .default("none"),
});

export const eventSchema = z.object({
  eventType: z.enum([
    "experience_started",
    "scene_viewed",
    "scene_completed",
    "audio_enabled",
    "audio_muted",
    "audio_skipped",
    "experience_completed",
  ]),
  sceneKey: z
    .enum([
      "recognition",
      "founder",
      "selection",
      "pillars",
      "products",
      "platform",
      "founding",
      "response",
      "completion",
    ])
    .nullable()
    .optional(),
});
