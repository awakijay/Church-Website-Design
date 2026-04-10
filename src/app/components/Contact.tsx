import { FormEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import logo from "../../assets/ihnbc-logo-2022.png";
import { openMailDraft } from "../lib/contactActions";
import { DonationSection } from "./DonationSection";

const weeklyActivities = [
  "Mon: Night Prayers - 7:00 PM - 7:30 PM - Online on WhatsApp",
  "Tues: House Fellowship - 5:00 PM",
  "Wed: Reaching Out, Follow-Up and Welfare - All-Day",
  "Thurs: Choir Rehearsal - 4:00 PM",
  "Fri: The King's Elites - 4:30 PM - 7:00 PM",
  "Sat: Sanctuary Keeping, Welfare, Follow-Up, Workers Meeting - 10:00 AM - 7:00 PM",
  "Sun: Church Service - 8:00 AM - 11:30 AM",
];

const FORM_SUBMIT_COOLDOWN_MS = 60_000;
const MIN_FORM_FILL_TIME_MS = 4_000;
const LAST_SUBMIT_STORAGE_KEY = "ihnbc-contact-last-submit";
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className ?? "h-6 w-6"} fill-current`}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.35h-3.17v12.58a2.86 2.86 0 1 1-2-2.73V9a6.04 6.04 0 1 0 5.2 5.98V8.57a8 8 0 0 0 4.77 1.56V6.69h-1.03Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className ?? "h-6 w-6"} fill-current`}
    >
      <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.24l-4.9-7.39L5.6 22H2.5l7.24-8.27L1.8 2h6.4l4.43 6.75L18.9 2Zm-1.09 18h1.72L7.26 3.9H5.41l12.4 16.1Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/stewardjornsen",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/stewardjornsen/",
    icon: Instagram,
  },
  {
    name: "X",
    href: "https://x.com/stewardjornsen",
    icon: XIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@stewardjornsen",
    icon: TiktokIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@StewardGodwinJornsen",
    icon: Youtube,
  },
];

export function Contact() {
  const { ref, inView } = useInView();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      const nextMessage = customEvent.detail?.message;

      if (nextMessage) {
        setMessage(nextMessage);
        setStatusMessage("We filled the form with your request below.");
      }
    };

    window.addEventListener("contact-prefill", handlePrefill);

    return () => {
      window.removeEventListener("contact-prefill", handlePrefill);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const now = Date.now();
    const lastSubmitAt = Number(window.localStorage.getItem(LAST_SUBMIT_STORAGE_KEY) ?? "0");

    if (website.trim()) {
      setStatusMessage("We could not verify this submission. Please try again.");
      return;
    }

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatusMessage("Please complete your name, email, and message first.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (now - formStartedAt < MIN_FORM_FILL_TIME_MS) {
      setStatusMessage("Please take a moment to review your message before sending.");
      return;
    }

    if (now - lastSubmitAt < FORM_SUBMIT_COOLDOWN_MS) {
      setStatusMessage("Please wait about a minute before sending another request.");
      return;
    }

    openMailDraft(trimmedName, trimmedEmail, trimmedMessage);
    window.localStorage.setItem(LAST_SUBMIT_STORAGE_KEY, String(now));
    setStatusMessage("Your email app should open with the message ready to send.");
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="scroll-mt-28 bg-white px-4 py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#1C2526] mb-4">
            Get In Touch
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl text-[#1C2526] mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-[#1C2526] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#1C2526]/20 focus:border-[#FF6B00] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[#1C2526] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#1C2526]/20 focus:border-[#FF6B00] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-[#1C2526] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#1C2526]/20 focus:border-[#FF6B00] focus:outline-none transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF6B00] text-white px-8 py-3 hover:bg-[#FF6B00]/90 transition-colors"
              >
                Send Message
              </button>
              {statusMessage ? (
                <p className="text-sm text-[#1C2526]/70">{statusMessage}</p>
              ) : null}
            </form>

            <div className="grid gap-4 border-t border-[#1C2526]/10 pt-6">
              <a
                href="mailto:stewardjornsen@gmail.com"
                className="flex items-center gap-3 text-[#1C2526]/80 transition-colors hover:text-[#FF6B00]"
              >
                <Mail className="h-5 w-5 text-[#FF6B00]" />
                <span>stewardjornsen@gmail.com</span>
              </a>
              <a
                href="tel:+2347077423125"
                className="flex items-center gap-3 text-[#1C2526]/80 transition-colors hover:text-[#FF6B00]"
              >
                <Phone className="h-5 w-5 text-[#FF6B00]" />
                <span>+234 707 742 3125</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-[#FFF8E8] to-white p-8 md:p-12"
          >
            <h3 className="text-2xl text-[#1C2526] mb-6">Connect With Us</h3>
            <p className="text-[#1C2526]/70 leading-relaxed mb-8">
              Stay connected with our church community through social media and receive updates about upcoming events, sermons, and ministry opportunities.
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00] text-white transition-colors hover:bg-[#FF6B00]/90"
                  >
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </a>
                );
              })}
            </div>

            <div className="border-t border-[#1C2526]/10 pt-8">
              <DonationSection compact />

              <div className="mt-10 border-t border-[#1C2526]/10 pt-8">
                <h4 className="mb-4 text-xl text-[#1C2526]">Weekly Activities</h4>
                <div className="space-y-2 text-[#1C2526]/70">
                {weeklyActivities.map((activity) => (
                  <div key={activity}>{activity}</div>
                ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="relative mt-24 overflow-hidden bg-[#171E1F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,107,0,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(255,221,0,0.14),_transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.9fr_1fr_1.1fr]">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/10 ring-1 ring-white/10">
                    <img
                      src={logo}
                      alt="In His Name Bible Church"
                      className="max-h-14 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#FFD7BA]">
                      Acts 3:16
                    </p>
                    <h3 className="mt-2 text-2xl">In His Name Bible Church</h3>
                  </div>
                </div>
                <p className="mt-6 max-w-sm text-sm leading-7 text-white/72">
                  A Christ-centered family proclaiming Jesus, teaching the Word,
                  and raising transformed lives through worship, fellowship, and service.
                </p>
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]"
                >
                  Contact the Church
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.26em] text-[#FFD7BA]">
                  Quick Links
                </h4>
                <div className="mt-5 space-y-3 text-sm text-white/76">
                  <a href="#about" className="block transition-colors hover:text-[#FFB26B]">
                    About Us
                  </a>
                  <a href="#ministries" className="block transition-colors hover:text-[#FFB26B]">
                    Ministries
                  </a>
                  <a href="#sermons" className="block transition-colors hover:text-[#FFB26B]">
                    Sermons
                  </a>
                  <a href="#events" className="block transition-colors hover:text-[#FFB26B]">
                    Events
                  </a>
                  <a href="donations.html" className="block transition-colors hover:text-[#FFB26B]">
                    Give Online
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.26em] text-[#FFD7BA]">
                  Church Activities
                </h4>
                <div className="mt-5 space-y-3 text-sm text-white/72">
                  {weeklyActivities.map((activity) => (
                    <div key={activity} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      {activity.startsWith("Mon:") ? (
                        <div className="space-y-2">
                          <div>{activity}</div>
                          <a
                            href="https://chat.whatsapp.com/EUVPvLQ8r72Ag8YpfhK44Y"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#7DFFAB] transition-colors hover:text-white"
                          >
                            Join on WhatsApp
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        activity
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.26em] text-[#FFD7BA]">
                  Visit & Contact
                </h4>
                <div className="mt-5 space-y-4 text-sm text-white/76">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB26B]" />
                    <span>
                      2 Church Rd, Sunlight Estate Gate
                      <br />
                      Incarnate Rd (Off Location Rd)
                      <br />
                      Umuebulu 2, Rivers, NG
                    </span>
                  </div>
                  <a
                    href="tel:+2347077423125"
                    className="flex items-center gap-3 transition-colors hover:text-[#FFB26B]"
                  >
                    <Phone className="h-5 w-5 text-[#FFB26B]" />
                    <span>+234 707 742 3125</span>
                  </a>
                  <a
                    href="mailto:stewardjornsen@gmail.com"
                    className="flex items-center gap-3 transition-colors hover:text-[#FFB26B]"
                  >
                    <Mail className="h-5 w-5 text-[#FFB26B]" />
                    <span>stewardjornsen@gmail.com</span>
                  </a>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;

                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={social.name}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white transition-colors hover:border-[#FF6B00]/40 hover:bg-[#FF6B00]"
                        >
                          {Icon ? <Icon className="h-5 w-5" /> : null}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/52 md:flex-row md:items-center md:justify-between">
              <p>&copy; 2026 In His Name Bible Church. All rights reserved.</p>
              <p>Proclaiming Jesus, Teaching the Word, Transforming Lives.</p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
