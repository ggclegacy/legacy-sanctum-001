const modules = [
  {
    key: "V",
    name: "Vitality",
    detail: "Protocol, recovery, and trusted wellness resources.",
  },
  {
    key: "M",
    name: "Mindset",
    detail: "Objectives, standards, reflection, and guided discipline.",
  },
  {
    key: "B",
    name: "Brotherhood",
    detail: "Curated introductions, private events, and trusted experts.",
  },
  {
    key: "L",
    name: "Legacy",
    detail: "Ventures, leadership, impact, and the long horizon.",
  },
];

export function MemberAppPreview() {
  return (
    <div className="member-preview" aria-label="Future member application preview">
      <div className="member-device">
        <div className="member-device__bar">
          <span>Legacy Sanctum</span>
          <span className="member-device__atlas">Atlas</span>
        </div>
        <div className="member-device__content">
          <p className="micro-label">Future member command center</p>
          <h3>Your operating system.</h3>
          <div className="focus-card">
            <span className="focus-card__index">Today</span>
            <div>
              <strong>One clear priority</strong>
              <p>
                Protocol, direction, and the next action—without the noise.
              </p>
            </div>
          </div>
          <div className="module-list">
            {modules.map((module) => (
              <div className="module-row" key={module.name}>
                <span className="module-key">{module.key}</span>
                <div>
                  <strong>{module.name}</strong>
                  <p>{module.detail}</p>
                </div>
                <span className="module-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="preview-notice">
        <span>In development</span>
        <p>
          Founding members enter first and help shape what comes next.
        </p>
      </div>
    </div>
  );
}
