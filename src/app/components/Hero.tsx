import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarHeart,
  Image as ImageIcon,
  PlayCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import heroLogo from "../../assets/ihnbc-logo-2022-white-no-circles.png";
import { activityGallery } from "../content/activityGallery";

const HERO_ROTATION_INTERVAL_MS = 5000;

function shufflePhotos(photos: typeof activityGallery) {
  const shuffled = [...photos];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function Hero() {
  const [{ photos, activeIndex }, setCarousel] = useState(() => {
    const shuffledPhotos = shufflePhotos(activityGallery);

    return {
      photos: shuffledPhotos,
      activeIndex:
        shuffledPhotos.length > 0
          ? Math.floor(Math.random() * shuffledPhotos.length)
          : 0,
    };
  });

  useEffect(() => {
    if (photos.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCarousel((current) => ({
        ...current,
        activeIndex: (current.activeIndex + 1) % current.photos.length,
      }));
    }, HERO_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [photos.length]);

  const activePhoto = photos[activeIndex] ?? activityGallery[0];
  const collagePhotos = Array.from({ length: 3 }, (_, offset) => {
    if (photos.length === 0) {
      return undefined;
    }

    return photos[(activeIndex + offset + 1) % photos.length];
  }).filter((photo) => Boolean(photo));

  return (
    <section
      id="home"
      className="relative min-h-screen w-full scroll-mt-28 overflow-hidden bg-[#150f19]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.34),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(17,132,204,0.30),_transparent_32%)]" />

      <div className="absolute inset-0">
        {photos.map((photo, index) => (
          <ImageWithFallback
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${
              index === activeIndex ? "opacity-34" : "opacity-0"
            }`}
            style={{ objectPosition: photo.objectPosition }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#120b16]/80 via-[#161019]/60 to-[#120f18]" />

      <div className="relative px-4 pb-16 pt-32 sm:pt-36">
        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="mb-6 mt-20 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD7BA]">
              <CalendarHeart className="h-4 w-4" />
              Welcome To
            </div>
            <div className="mb-6  ">
              <img
                src={heroLogo}
                alt="In His Name Bible Church"
                className="max-h-24 w-auto max-w-full object-contain sm:max-h-28 lg:max-h-32"
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
                <div className="relative overflow-hidden rounded-[26px]">
                  <img
                    src={activePhoto?.src}
                    alt={activePhoto?.alt}
                    className="h-[340px] w-full object-cover"
                    style={{ objectPosition: activePhoto?.objectPosition }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#09090A]/92 via-[#09090A]/55 to-transparent p-6">
                    {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#FFD7BA]">
                      <ImageIcon className="h-3.5 w-3.5" />
                     
                    </div> */}
                    <p className="mt-4 text-2xl text-white">
                      {activePhoto?.title ?? "Church Moments"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/72">
                      {activePhoto?.subtitle}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      {photos.map((photo, index) => (
                        <span
                          key={photo.id}
                          className={`h-2 rounded-full transition-all ${
                            index === activeIndex
                              ? "w-8 bg-[#FF6B00]"
                              : "w-2 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {collagePhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`overflow-hidden rounded-[30px] border border-white/12 bg-white/10 p-3 shadow-[0_22px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className={`w-full rounded-[24px] object-cover ${
                        index === 0 ? "h-[200px]" : "h-[180px]"
                      }`}
                      style={{ objectPosition: photo.objectPosition }}
                    />
                    <div className="p-4 pb-2">
                      <p className="text-base text-white">{photo.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {photo.dateLabel}
                      </p>
                    </div>
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
