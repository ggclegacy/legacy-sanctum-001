import { motion } from "framer-motion";

export function AtlasOrb({
  active = false,
  reducedMotion = false,
}: {
  active?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <div
      className={`preview-atlas-orb${active ? " is-active" : ""}`}
      aria-hidden="true"
    >
      <motion.i
        className="preview-atlas-orb__orbit preview-atlas-orb__orbit--outer"
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 24,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.i
        className="preview-atlas-orb__orbit preview-atlas-orb__orbit--inner"
        animate={reducedMotion ? undefined : { rotate: -360 }}
        transition={{
          duration: 17,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <span>A</span>
    </div>
  );
}
