"use client";

import { motion } from "framer-motion";

export function PreviewIntroduction({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const systems = [
    "Bloodwork",
    "Sleep",
    "Recovery",
    "Hormones",
    "Nutrition",
    "Stress",
    "Movement",
    "Goals",
  ];

  return (
    <section className="preview-introduction">
      <div className="preview-introduction__copy">
        <span>Discovery 01</span>
        <h2>Your Human Digital Twin</h2>
        <p>
          A living relationship model that connects the signals shaping your
          capacity, performance, and long horizon.
        </p>
      </div>
      <div className="preview-assembly" aria-label="Systems ready to assemble">
        {systems.map((system, index) => (
          <motion.div
            key={system}
            initial={reducedMotion ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reducedMotion ? 0 : index * 0.07,
              duration: reducedMotion ? 0 : 0.45,
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{system}</strong>
            <i />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
