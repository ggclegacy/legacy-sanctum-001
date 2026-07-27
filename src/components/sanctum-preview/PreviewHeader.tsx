"use client";

import Image from "next/image";

export function PreviewHeader({
  firstName,
  memberNumber,
  captionsEnabled,
  onToggleCaptions,
}: {
  firstName: string;
  memberNumber: string;
  captionsEnabled: boolean;
  onToggleCaptions: () => void;
}) {
  return (
    <header className="preview-system-header">
      <div className="preview-system-brand">
        <Image src="/icon.png" alt="" width={34} height={34} />
        <div>
          <strong>Legacy Sanctum</strong>
          <span>The Atlas Demonstration</span>
        </div>
      </div>
      <div className="preview-system-state">
        <span>
          <i />
          Private demonstration
        </span>
        <b>
          {firstName} · {memberNumber}
        </b>
      </div>
      <button
        className="preview-caption-control"
        type="button"
        aria-pressed={captionsEnabled}
        onClick={onToggleCaptions}
      >
        CC {captionsEnabled ? "On" : "Off"}
      </button>
    </header>
  );
}
