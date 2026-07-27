import "server-only";

export const ATLAS_VOICE_MODEL_ID = "eleven_multilingual_v2";
export const ATLAS_VOICE_OUTPUT_FORMAT = "mp3_44100_128";
export const ATLAS_NARRATION_MAX_CHARACTERS = 600;
export const ATLAS_VOICE_REQUEST_TIMEOUT_MS = 30_000;

export const atlasVoiceSettings = Object.freeze({
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.2,
  use_speaker_boost: true,
  speed: 0.94,
});

export function getAtlasVoiceRuntimeConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim() ?? "";
  const voiceId = process.env.ATLAS_VOICE_ID?.trim() ?? "";

  return {
    apiKey,
    voiceId,
    modelId: ATLAS_VOICE_MODEL_ID,
    outputFormat: ATLAS_VOICE_OUTPUT_FORMAT,
    requestTimeoutMs: ATLAS_VOICE_REQUEST_TIMEOUT_MS,
    voiceSettings: atlasVoiceSettings,
  };
}
