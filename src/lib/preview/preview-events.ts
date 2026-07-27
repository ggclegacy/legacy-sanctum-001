import type { PreviewEvent, PreviewEventName } from "./preview-types";

export function emitPreviewEvent(
  name: PreviewEventName,
  detail: Omit<PreviewEvent, "name" | "occurredAt"> = {},
) {
  const event: PreviewEvent = {
    name,
    ...detail,
    occurredAt: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    console.info("[Legacy Sanctum preview]", event);
  }

  return event;
}
