import { motion } from "motion/react";
import { ArrowRight, CalendarHeart, PlayCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logo from "../../assets/ihnbc-logo-2022.png";
import { activityGallery } from "../content/activityGallery";

export function Hero() {
  const heroPhoto = activityGallery[0];
  const collagePhotos = activityGallery.slice(1, 4);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full scroll-mt-28 overflow-hidden bg-[#150f19]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.34),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(17,132,204,0.30),_transparent_32%)]" />

      <ImageWithFallback
        src={heroPhoto.src}
        alt={heroPhoto.alt}
        className="absolute inset-0 h-full w-full object-cover opacity-34"
        style={{ objectPosition: heroPhoto.objectPosition }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#120b16]/80 via-[#161019]/60 to-[#120f18]" />

      <div className="relative px-4 pb-16 pt-32 sm:pt-36">
        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD7BA]">
              <CalendarHeart className="h-4 w-4" />
              Welcome To
            </div>
            <div className="mb-6 rounded-xl w-60 p-4 bg-white/20 backdrop-blur-xl">
              <img
                src={logo}
                alt="In His Name Bible Church"
                className="max-h-36 w-auto max-w-full object-contain sm:max-h-44 lg:max-h-52"
              />
            </div>
            <h1 className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl lg:text-7xl">
              A church family alive with worship, truth, and community.
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl"
            >
              Proclaiming Jesus, teaching the Word, and transforming lives
              through vibrant worship, heartfelt fellowship, and purposeful
              discipleship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href="#visit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-8 py-4 text-lg text-white shadow-[0_18px_35px_rgba(255,107,0,0.24)] transition-all hover:-translate-y-1 hover:bg-[#FF6B00]/90"
              >
                Plan Your Visit
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#moments"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-8 py-4 text-lg text-white transition-all hover:-translate-y-1 hover:border-[#FF6B00]/50"
              >
                <PlayCircle className="h-5 w-5" />
                See Church Moments
              </a>
            </motion.div>

            <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
              {[
                ["Living Worship", "Spirit-filled gatherings"],
                ["Warm Fellowship", "A welcoming church family"],
                ["Strong Teaching", "Biblical truth for daily life"],
              ].map(([title, text], index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.75 + index * 0.08 }}
                  className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/62">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-[#FF6B00]/28 blur-3xl" />
            <div className="absolute bottom-6 right-0 h-32 w-32 rounded-full bg-[#1184CC]/30 blur-3xl" />
            <div className="grid gap-5">
              <div className="ml-auto w-[78%] overflow-hidden rounded-[34px] border border-white/12 bg-white/10 p-3 shadow-[0_22px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <img
                  src={collagePhotos[0]?.src}
                  alt={collagePhotos[0]?.alt}
                  className="h-[340px] w-full rounded-[26px] object-cover"
                  style={{ objectPosition: collagePhotos[0]?.objectPosition }}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                {collagePhotos.slice(1).map((photo) => (
                  <div
                    key={photo.src}
                    className="overflow-hidden rounded-[30px] border border-white/12 bg-white/10 p-3 shadow-[0_22px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-[280px] w-full rounded-[24px] object-cover"
                      style={{ objectPosition: photo.objectPosition }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
