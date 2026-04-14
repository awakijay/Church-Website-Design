import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";

export function Welcome() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="bg-white px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#FF6B00]">
            IHNBC - A Synergy of Revelation and Education
          </p>

          <h2 className="text-4xl text-[#1C2526] md:text-5xl">Welcome Home</h2>

          <div className="mx-auto h-1 w-24 bg-[#FF6B00]" />

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#1C2526]/80 md:text-xl">
            We are a Spirit-filled Bible church rooted in the authority of
            Scripture and the power of Jesus&apos; name. Whether you are exploring
            faith, growing as a believer, or looking for a church family, there
            is room for you here.
          </p>

          <div className="mt-12 rounded-[32px] border border-[#FF6B00]/18 border-l-[6px] border-l-[#FF6B00] bg-gradient-to-br from-[#FFF8E8] to-[#FFDD00]/10 p-6 shadow-[0_18px_45px_rgba(28,37,38,0.06)] sm:p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
              Theme Verse
            </p>
            <p className="mt-4 text-xl italic leading-relaxed text-[#1C2526] md:text-2xl">
              &quot;And his name through faith in his name hath made this man
              strong, whom ye see and know: yea, the faith which is by him hath
              given him this perfect soundness in the presence of you all.&quot;
            </p>
            <p className="mt-4 text-[#FF6B00]">Acts 3:16 (AKJV)</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
