import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import { Heart, BookOpen, Users } from "lucide-react";
import { activityGallery } from "../content/activityGallery";

export function About() {
  const { ref, inView } = useInView();
  const aboutPhoto = activityGallery[10] ?? activityGallery[0];

  const values = [
    {
      icon: Heart,
      title: "Love God",
      description: "We passionately pursue God through worship, prayer, and His Word",
    },
    {
      icon: BookOpen,
      title: "Know Truth",
      description: "We are committed to biblical teaching and sound doctrine",
    },
    {
      icon: Users,
      title: "Serve Others",
      description: "We reach out in love to our community and the world",
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#1C2526] mb-4">
            About Us
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-[#FF6B00]/18 blur-3xl" />
              <div className="overflow-hidden rounded-[36px] border border-[#1C2526]/8 bg-white p-3 shadow-[0_24px_60px_rgba(28,37,38,0.16)]">
                <img
                  src={aboutPhoto.src}
                  alt={aboutPhoto.alt}
                  className="h-[430px] w-full rounded-[28px] object-cover"
                  style={{ objectPosition: aboutPhoto.objectPosition }}
                />
              </div>
              <div className="absolute -bottom-6 right-6 max-w-xs rounded-[28px] border border-[#1C2526]/10 bg-white/92 p-5 shadow-[0_18px_40px_rgba(28,37,38,0.14)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FF6B00]">
                  Church Life
                </p>
                <p className="mt-3 text-sm leading-6 text-[#1C2526]/72">
                  Real people, real worship, and a real community where faith grows together.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-lg text-[#1C2526]/80 leading-relaxed">
              In His Name Bible Church is a Christ-centered community where people encounter God's transforming love. We believe in the authority of Scripture, the power of prayer, and the importance of authentic fellowship.
            </p>
            <p className="text-lg text-[#1C2526]/80 leading-relaxed">
              Our mission is to glorify God by making disciples who love Jesus, grow in faith, and serve the world with hope and compassion.
            </p>

            <div className="mt-8 grid gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.45 + index * 0.08 }}
                  className="flex gap-4 rounded-[24px] border border-[#1C2526]/8 bg-white/70 p-4 shadow-[0_10px_30px_rgba(28,37,38,0.06)]"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#FF6B00]">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#1C2526] mb-2">{value.title}</h3>
                    <p className="text-[#1C2526]/70">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
