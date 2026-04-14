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
  Sparkles,
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

const identityItems = [
  {
    label: "Motto",
    text: "Reaching Out to the World In His Name",
  },
  {
    label: "Tagline",
    text: "IHNBC - A Synergy of Revelation and Education",
  },
];

const missionVisionItems = [
  {
    eyebrow: "Mission Statement",
    title: "Reach the world in Jesus' name",
    body:
      "To reach the world in the powerful name of Jesus Christ by winning souls through bold evangelism, building believers with the undiluted Word of God, educating and discipling the younger generation, and raising strong, successful, godly families - all through faith in His name.",
  },
  {
    eyebrow: "Vision Statement",
    title: "Raise a vibrant Pentecostal Bible church",
    body:
      "To raise a vibrant, Spirit-filled Pentecostal Bible Church that operates in the authority of the Scriptures and the power of the name of Jesus, producing mature believers who manifest the Holy Spirit and impact their communities through dynamic prayer, worship, and outreach.",
  },
];

const coreValues = [
  {
    icon: Heart,
    letter: "N",
    title: "Name of Jesus",
    scripture: "Phil. 2:9-11; Acts 4:12",
    description:
      "We stand on the supreme authority and saving power of the name of Jesus Christ.",
  },
  {
    icon: BookOpen,
    letter: "A",
    title: "Authority of the Bible",
    scripture: "2 Tim. 3:16-17",
    description:
      "We embrace the Scriptures as our infallible guide, foundation, and weapon.",
  },
  {
    icon: Sparkles,
    letter: "M",
    title: "Manifestation of the Holy Spirit",
    scripture: "Acts 2:4; 1 Cor. 12:7-11",
    description:
      "We welcome Holy Spirit baptism, spiritual gifts, healing, and miracles in the life of the church.",
  },
  {
    icon: Users,
    letter: "E",
    title: "Evangelism and Discipleship",
    scripture: "Matt. 28:19-20; Acts 1:8",
    description:
      "We are committed to soul-winning and raising disciples who live boldly for Christ.",
  },
];

const creedItems = [
  "In one true God in three Persons - Father, Son, and Holy Spirit.",
  "The Bible, all 66 books, is the inspired and infallible Word of God.",
  "In Jesus Christ - His deity, virgin birth, sinless life, miracles, death, resurrection, ascension, and return.",
  "Salvation by grace through faith alone.",
  "In the empowering ministry of the Holy Spirit.",
  "In Holy Spirit baptism with tongues as the initial evidence.",
  "In all spiritual gifts operating today.",
  "In water baptism by immersion and the Lord's Supper.",
  "In marriage between one man and one woman, and in godly families.",
  "In the resurrection - the saved to life and the lost to judgment.",
  "In the Great Commission with signs following in Jesus' name.",
];

export function About() {
  const { ref, inView } = useInView();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const aboutPhotos = activityGallery;

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

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl text-[#1C2526] md:text-5xl">About Us</h2>
          <div className="mx-auto h-1 w-24 bg-[#FF6B00]" />
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
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

                  {aboutPhotos.length > 1 ? (
                    <div className="absolute inset-x-0 bottom-0 flex justify-end p-4 sm:p-5">
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
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#1C2526]/10 bg-white p-6 shadow-[0_16px_40px_rgba(28,37,38,0.08)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FF6B00]">
                  Quick Contact
                </p>
                <h3 className="mt-3 text-2xl text-[#1C2526]">
                  Connect with IHNBC
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#1C2526]/65">
                  Reach out with questions, share a prayer request, or plan
                  your visit while you are getting to know our church family.
                </p>
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {identityItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.45 + index * 0.08 }}
                  className="rounded-[22px] border border-[#1C2526]/8 bg-white/75 p-4 shadow-[0_10px_24px_rgba(28,37,38,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF6B00]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#1C2526]/78">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-lg leading-relaxed text-[#1C2526]/80">
              In His Name Bible Church is a multicultural and people-friendly
              church. We are a synergy of revelation and education, and a fusion
              of spirituality, intelligence, and technology, all centered on
              Jesus Christ and faith in His name.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {missionVisionItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.52 + index * 0.08 }}
                  className="rounded-[24px] border border-[#1C2526]/8 bg-white/80 p-5 shadow-[0_10px_30px_rgba(28,37,38,0.06)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF6B00]">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 text-xl text-[#1C2526]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#1C2526]/74">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                Core Values
              </p>
              <h3 className="mt-3 text-2xl text-[#1C2526]">
                NAME is how we live and lead.
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {coreValues.map((value, index) => {
                  const Icon = value.icon;

                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.62 + index * 0.08 }}
                      className="flex gap-4 rounded-[24px] border border-[#1C2526]/8 bg-white/70 p-4 shadow-[0_10px_30px_rgba(28,37,38,0.06)]"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B00] text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full bg-[#FFF3E3] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B00]">
                            {value.letter}
                          </span>
                          <h4 className="text-lg text-[#1C2526]">{value.title}</h4>
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1C2526]/45">
                          {value.scripture}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#1C2526]/72">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 rounded-[32px] border border-[#1C2526]/10 bg-white p-6 shadow-[0_20px_50px_rgba(28,37,38,0.08)] sm:p-8 lg:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FF6B00]">
              Confession of Faith
            </p>
            <h3 className="mt-4 text-3xl text-[#1C2526] sm:text-4xl">
              IHNBC Creed
            </h3>
            <p className="mt-4 text-base leading-7 text-[#1C2526]/72">
              This is our faith. We stand on it. We live it. We proclaim it in
              the mighty name of Jesus.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {creedItems.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 rounded-[24px] border border-[#1C2526]/8 bg-[#FFF8E8] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-[#1C2526]/78">{item}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium text-[#1C2526]">
            We live and proclaim this faith in the mighty name of Jesus. Amen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
