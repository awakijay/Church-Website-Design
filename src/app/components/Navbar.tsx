import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../../assets/ihnbc-logo-2022.png";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminHref = "admin.html";
  const giveHref = "donations.html";

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Quotes", href: "#quotes" },
    { name: "Graphics", href: "#graphic-memes" },
    { name: "Ministries", href: "#ministries" },
    { name: "Sermons", href: "#sermons" },
    { name: "Events", href: "#events" },
    { name: "Visit", href: "#visit" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 lg:px-5">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/60 bg-white/88 shadow-[0_20px_60px_rgba(28,37,38,0.12)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-[4.5rem] w-[6.5rem] shrink-0 items-center justify-center rounded-2xl bg-[#FFF8E8] ring-1 ring-[#1C2526]/8 sm:h-24 sm:w-32">
              <img
                src={logo}
                alt="In His Name Bible Church"
                className="max-h-14 w-auto max-w-[5.25rem] object-contain sm:max-h-20 sm:max-w-[6.75rem]"
              />
            </div>
            <div className="min-w-0 text-[#1C2526] leading-tight">
              {/* <div className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#FF6B00] sm:text-xs">
                Acts 3:16
              </div> */}
              <div className="text-sm font-semibold sm:text-lg">
                In His Name
              </div>
              <div className="text-xs text-[#1C2526]/70 sm:text-sm">
                Bible Church
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#1C2526]/8 bg-[#FFF8E8]/80 px-3 py-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-[#1C2526] transition-colors hover:bg-white hover:text-[#FF6B00]"
              >
                {link.name}
              </a>
            ))}
            <a
              href={giveHref}
              className="rounded-full bg-[#FF6B00] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_rgba(255,107,0,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#FF6B00]/90"
            >
              Give
            </a>
            <a
              href={adminHref}
              aria-label="Open admin portal"
              title="Open Admin Portal"
              className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/15 bg-white px-3 py-2 text-xs font-medium text-[#1C2526] transition-all hover:-translate-y-0.5 hover:border-[#FF6B00]/40 hover:text-[#FF6B00] lg:gap-3 lg:px-4 lg:py-2.5 lg:text-sm"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E8] text-[#FF6B00] lg:h-8 lg:w-8">
                <ShieldCheck size={16} />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-[#FF6B00]">
                  Staff Only
                </span>
                <span className="block">Admin Portal</span>
              </span>
            </a>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full border border-[#1C2526]/10 bg-[#FFF8E8] p-3 text-[#1C2526] transition-colors hover:bg-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[28px] border border-white/60 bg-white/96 shadow-[0_20px_60px_rgba(28,37,38,0.12)] backdrop-blur-xl md:hidden"
          >
            <div className="space-y-2 px-3 py-4 sm:px-4 sm:py-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[#1C2526] transition-colors hover:bg-[#FFF8E8] hover:text-[#FF6B00]"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={giveHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 block rounded-2xl bg-[#FF6B00] px-5 py-3 text-center text-sm font-medium text-white shadow-[0_10px_25px_rgba(255,107,0,0.25)] transition-colors hover:bg-[#FF6B00]/90 sm:px-6"
              >
                Give
              </a>
              <a
                href={adminHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-3 rounded-2xl border border-[#FF6B00]/15 bg-white px-4 py-3 text-center text-sm font-medium text-[#1C2526] transition-colors hover:border-[#FF6B00]/40 hover:text-[#FF6B00] sm:px-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4E8] text-[#FF6B00]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-[#FF6B00]">
                    Staff Only
                  </span>
                  <span className="block">Open Admin Portal</span>
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
