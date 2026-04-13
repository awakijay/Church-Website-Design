import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { activityGallery } from "../content/activityGallery";
import { useInView } from "./hooks/useInView";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const ABOUT_CAROUSEL_INTERVAL_MS = 4500;

const aboutContactItems = [
  {
    label: "Call Us",
    value: "+234 707 742 3125",
    href: "tel:+2347077423125",
    icon: Phone,
  },
  {
    label: "Email Us",
    value: "inhisnamebiblechurch@gmail.com",
    href: "mailto:inhisnamebiblechurch@gmail.com",
    icon: Mail,
  },
  {
    label: "Visit Us",
    value: "2 Church Rd, Sunlight Estate Gate, Umuebulu 2, Rivers, NG",
    href: "#visit",
    icon: MapPin,
  },
];

export function About() {
  const { ref, inView } = useInView();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const aboutPhotos = activityGallery;
  const activePhoto = aboutPhotos[activePhotoIndex] ?? aboutPhotos[0];

  useEffect(() => {
    if (aboutPhotos.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActivePhotoIndex((current) => (current + 1) % aboutPhotos.length);
    }, ABOUT_CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [aboutPhotos.length]);

  function showPreviousPhoto() {
    if (aboutPhotos.length <= 1) {
      return;
    }

    setActivePhotoIndex(
      (current) => (current - 1 + aboutPhotos.length) % aboutPhotos.length,
    );
  }

  function showNextPhoto() {
    if (aboutPhotos.length <= 1) {
      return;
    }

    setActivePhotoIndex((current) => (current + 1) % aboutPhotos.length);
  }

  const values = [
    {
      icon: Heart,
      title: "Love God",
      description:
        "We passionately pursue God through worship, prayer, and His Word",
    },
    {
      icon: BookOpen,
      title: "Know Truth",
      description:
        "We are committed to biblical teaching and sound doctrine",
    },
    {
      icon: Users,
      title: "Serve Others",
      description:
        "We reach out in love to our community and the world",
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
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
              <div className="overflow-hidden rounded-[30px] border border-[#1C2526]/8 bg-white p-2.5 shadow-[0_24px_60px_rgba(28,37,38,0.16)] sm:rounded-[36px] sm:p-3">
                <div className="relative h-[320px] overflow-hidden rounded-[24px] sm:h-[430px] sm:rounded-[28px] lg:h-[520px]">
                  {aboutPhotos.map((photo, index) => (
                    <ImageWithFallback
                      key={photo.id}
                      src={photo.src}
                      alt={photo.alt}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
                        index === activePhotoIndex ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ objectPosition: photo.objectPosition }}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090A]/32 via-transparent to-transparent" />
                  {aboutPhotos.length > 1 ? (
                    <div className="absolute right-3 top-3 flex items-center gap-2 sm:right-5 sm:top-5">
                      <button
                        type="button"
                        onClick={showPreviousPhoto}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/18 sm:h-11 sm:w-11"
                        aria-label="Show previous about photo"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={showNextPhoto}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/18 sm:h-11 sm:w-11"
                        aria-label="Show next about photo"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-5">
                    {/* <div className="min-w-0 max-w-lg">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FFD7BA]">
                        About Carousel
                      </p>
                      <p className="mt-2 text-lg text-white sm:text-xl">
                        {activePhoto?.title ?? "Church Life"}
                      </p>
                      <p className="mt-2 text-sm text-white/88">
                        {activePhoto?.subtitle ??
                          "Everyday moments of worship, fellowship, and church life."}
                      </p>
                    </div> */}
                    {aboutPhotos.length > 1 ? (
                      <div className="w-full sm:w-auto">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/65 sm:text-right">
                          {activePhotoIndex + 1}/{aboutPhotos.length}
                        </div>
                        <div className="hide-scrollbar flex max-w-full items-center gap-2 overflow-x-auto pb-1 sm:justify-end">
                          {aboutPhotos.map((photo, index) => (
                            <button
                              key={`${photo.id}-dot`}
                              type="button"
                              onClick={() => setActivePhotoIndex(index)}
                              className={`h-2 shrink-0 rounded-full transition-all ${
                                index === activePhotoIndex
                                  ? "w-8 bg-[#FF6B00]"
                                  : "w-2 bg-white/55"
                              }`}
                              aria-label={`Show about photo ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="relative mt-4 ml-auto max-w-[90%] rounded-[28px] border border-[#1C2526]/10 bg-white/92 p-5 shadow-[0_18px_40px_rgba(28,37,38,0.14)] backdrop-blur-xl sm:absolute sm:-bottom-6 sm:right-6 sm:mt-0 sm:max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FF6B00]">
                  Church Life
                </p>
                <p className="mt-3 text-sm leading-6 text-[#1C2526]/72">
                  Real people, real worship, and a real community where faith
                  grows together.
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
              In His Name Bible Church is a Christ-centered community where
              people encounter God's transforming love. We believe in the
              authority of Scripture, the power of prayer, and the importance of
              authentic fellowship.
            </p>
            <p className="text-lg text-[#1C2526]/80 leading-relaxed">
              Our mission is to glorify God by making disciples who love Jesus,
              grow in faith, and serve the world with hope and compassion.
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

            <div className="rounded-[28px] border border-[#1C2526]/10 bg-white p-6 shadow-[0_16px_40px_rgba(28,37,38,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FF6B00]">
                    Quick Contact
                  </p>
                  <h3 className="mt-3 text-2xl text-[#1C2526]">
                    Reach the church quickly
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#1C2526]/65">
                    Keep the key contact routes visible while visitors are still
                    learning about the church, so calling, emailing, or planning
                    a visit never feels like extra work.
                  </p>
                </div>
                {/* <a
                  href="#contact"
                  className="hidden rounded-full border border-[#1C2526]/10 bg-[#FFF8E8] px-4 py-2 text-sm text-[#1C2526] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] sm:inline-flex sm:items-center sm:gap-2"
                >
                  Contact Page
                  <ArrowRight className="h-4 w-4" />
                </a> */}
              </div>

              <div className="mt-6 grid gap-4">
                {aboutContactItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 rounded-[22px] border border-[#1C2526]/8 bg-[#FFF8E8] px-4 py-4 text-[#1C2526] transition-colors hover:border-[#FF6B00]/40"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B00] text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[#FF6B00]">
                        {item.label}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-[#1C2526]/76">
                        {item.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#visit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm text-white transition-colors hover:bg-[#FF6B00]/90 sm:w-auto"
                >
                  Plan Your Visit
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1C2526]/10 bg-white px-5 py-3 text-sm text-[#1C2526] transition-colors hover:border-[#FF6B00] hover:text-[#FF6B00] sm:w-auto"
                >
                  Send A Message
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
