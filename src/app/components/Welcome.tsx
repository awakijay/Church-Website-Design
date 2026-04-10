import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";

export function Welcome() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="bg-white px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-4xl text-[#1C2526] md:text-5xl">Welcome Home</h2>

          <div className="mx-auto h-1 w-24 bg-[#FF6B00]" />

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#1C2526]/80 md:text-xl">
            We are a community of believers committed to knowing Christ and
            making Him known. Whether you're seeking, exploring faith, or
            looking for a church family, you belong here.
          </p>

          <div className="mt-12 border-l-4 border-[#FF6B00] bg-gradient-to-br from-[#FFF8E8] to-[#FFDD00]/10 p-8 md:p-12">
            <p className="text-xl italic leading-relaxed text-[#1C2526] md:text-2xl">
              "For God so loved the world that he gave his one and only Son,
              that whoever believes in him shall not perish but have eternal
              life."
            </p>
            <p className="mt-4 text-[#FF6B00]">- John 3:16</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
