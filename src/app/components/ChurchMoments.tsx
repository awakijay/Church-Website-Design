import { motion } from "motion/react";
import { Camera, Sparkles } from "lucide-react";
import { useInView } from "./hooks/useInView";
import { activityGallery } from "../content/activityGallery";

export function ChurchMoments() {
  const { ref, inView } = useInView();
  const featured = activityGallery.slice(4, 10);

  return (
    <section
      id="moments"
      ref={ref}
      className="relative overflow-hidden bg-[#1C2526] px-4 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(17,132,204,0.24),_transparent_34%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFD7BA]">
            <Camera className="h-4 w-4" />
            Church Moments
          </div>
          <h2 className="text-4xl md:text-6xl">
            A living church family, not just a Sunday gathering.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
            These moments capture worship, fellowship, ministry, and the warmth
            of a community growing together in Christ.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.slice(0, 4).map((photo, index) => (
              <motion.article
                key={`${photo.title}-${index}`}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.08 * index }}
                className={`group overflow-hidden rounded-[30px] border border-white/10 bg-white/6 shadow-[0_18px_40px_rgba(0,0,0,0.24)] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className={`${index === 0 ? "h-[320px]" : "h-[260px]"} overflow-hidden`}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xl">{photo.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {photo.subtitle}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/8 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#FFD7BA]">
                    Worship
                  </p>
                  <p className="mt-3 text-3xl">Spirit-Filled</p>
                </div>
                <div className="rounded-[24px] bg-white/8 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#FFD7BA]">
                    Community
                  </p>
                  <p className="mt-3 text-3xl">Welcoming</p>
                </div>
              </div>
              <div className="mt-5 rounded-[24px] border border-white/10 bg-[#FF6B00]/12 p-5">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#FFD7BA]">
                  <Sparkles className="h-4 w-4" />
                  What to expect
                </div>
                <p className="mt-3 text-base leading-7 text-white/75">
                  Joyful worship, sincere prayer, practical Bible teaching, and
                  a church family that makes room for everyone to belong.
                </p>
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {featured.slice(4, 6).map((photo, index) => (
                <motion.article
                  key={`${photo.title}-${index + 4}`}
                  initial={{ opacity: 0, y: 32, scale: 0.96 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.28 + 0.08 * index }}
                  className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/6 shadow-[0_16px_36px_rgba(0,0,0,0.22)]"
                >
                  <div className="h-[220px] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: photo.objectPosition }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg">{photo.title}</p>
                    <p className="mt-2 text-sm text-white/65">{photo.subtitle}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
