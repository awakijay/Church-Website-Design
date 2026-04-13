import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Quote, Share2 } from "lucide-react";
import { useChurchContent } from "../content/ChurchContentContext";
import { QuoteCategory, QuoteItem } from "../content/churchContent";
import { activityGallery } from "../content/activityGallery";
import { useInView } from "./hooks/useInView";
import { ContentDetailsDialog } from "./ContentDetailsDialog";

function createShareText(quote: QuoteItem) {
  return `"${quote.text}" - ${quote.reference} (${quote.category})`;
}

export function Quotes() {
  const { ref, inView } = useInView();
  const {
    content: { quotes },
  } = useChurchContent();
  const [activeCategory, setActiveCategory] =
    useState<QuoteCategory | "All">("All");
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  const categories: Array<QuoteCategory | "All"> = [
    "All",
    "Faith",
    "Prayer",
    "Love",
    "Hope",
    "Teaching",
  ];

  const filteredQuotes =
    activeCategory === "All"
      ? quotes
      : quotes.filter((quote) => quote.category === activeCategory);

  const heroPhoto = activityGallery[2] ?? activityGallery[0];
  const canUseNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  async function handleShareQuote(quote: QuoteItem) {
    const shareText = createShareText(quote);

    if (canUseNativeShare) {
      try {
        await navigator.share({
          title: "Inspirational Quote",
          text: shareText,
        });
        return;
      } catch {
        // Fall back to clipboard when sharing is cancelled or unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedQuoteId(quote.id);
      window.setTimeout(() => setCopiedQuoteId(null), 2000);
    } catch {
      setCopiedQuoteId(null);
    }
  }

  return (
    <section
      id="quotes"
      ref={ref}
      className="scroll-mt-28 overflow-hidden bg-[#171E1F] px-4 py-16 text-white sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="absolute inset-x-0 mt-[-5rem] h-64 bg-[radial-gradient(circle_at_top,_rgba(255,107,0,0.18),_transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 grid gap-6 sm:gap-8 xl:mb-12 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFD7BA]">
              <Quote className="h-4 w-4" />
              Quotes
            </div>
            <h2 className="text-4xl md:text-6xl">
              A beautiful home for Scripture and hope-filled words.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Explore inspirational quotes by theme, open each one for a fuller
              reflection, and share them with a single tap.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    activeCategory === category
                      ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                      : "border-white/12 bg-white/6 text-white/78 hover:border-[#FF6B00]/40 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:rounded-[38px]">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              className="h-full min-h-[300px] w-full object-cover sm:min-h-[340px]"
              style={{ objectPosition: heroPhoto.objectPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#120b16]/70 via-[#171E1F]/42 to-[#FF6B00]/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#FFD7BA]">
                Featured Reflection
              </p>
              <p className="mt-4 max-w-lg text-xl leading-8 text-white sm:text-2xl sm:leading-9 md:text-3xl">
                "{filteredQuotes[0]?.text ?? quotes[0]?.text ?? "Words of life for every season."}"
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-white/72">
                {filteredQuotes[0]?.reference ?? quotes[0]?.reference ?? "Church Quote"}
              </p>
            </div>
          </div>
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00] text-white">
              <Quote className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFD7BA]">
                Quote Library
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl">
                Shareable church quotes by category
              </h3>
            </div>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {filteredQuotes.map((quote, index) => {
              const photo =
                activityGallery[(index + 1) % activityGallery.length] ?? heroPhoto;

              return (
                <motion.article
                  key={quote.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.18 + index * 0.07 }}
                  className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/6 shadow-[0_20px_45px_rgba(0,0,0,0.2)]"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: photo.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#171E1F]/58 via-[#171E1F]/72 to-[#171E1F]/90" />

                  <div className="relative flex min-h-[300px] flex-col justify-between p-5 sm:min-h-[320px] sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#FFD7BA]">
                        {quote.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleShareQuote(quote)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition-colors hover:border-[#FF6B00]/50 hover:bg-[#FF6B00] sm:h-11 sm:w-11"
                        aria-label={`Share quote from ${quote.reference}`}
                        title="Share quote"
                      >
                        {copiedQuoteId === quote.id ? (
                          <Check className="h-5 w-5" />
                        ) : canUseNativeShare ? (
                          <Share2 className="h-5 w-5" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedQuote(quote)}
                      className="mt-8 flex flex-1 flex-col justify-between text-left"
                    >
                      <div>
                        <p className="text-xl leading-8 text-white sm:text-2xl sm:leading-9">
                          "{quote.text}"
                        </p>
                      </div>

                      <div className="pt-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFD7BA]">
                          {quote.reference}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/56">
                          {copiedQuoteId === quote.id
                            ? "Copied for sharing"
                            : "Tap the quote card to open the full reflection"}
                        </p>
                      </div>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <ContentDetailsDialog
        open={Boolean(selectedQuote)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQuote(null);
          }
        }}
        eyebrow="Quote Details"
        title={selectedQuote?.reference ?? ""}
        summary={
          selectedQuote
            ? `A ${selectedQuote.category.toLowerCase()} reflection for encouragement, meditation, and sharing.`
            : undefined
        }
        meta={
          selectedQuote
            ? [
                { label: "Category", value: selectedQuote.category },
                { label: "Reference", value: selectedQuote.reference },
              ]
            : []
        }
        footer={
          selectedQuote ? (
            <button
              type="button"
              onClick={() => void handleShareQuote(selectedQuote)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FF6B00]/90 sm:w-auto"
            >
              {copiedQuoteId === selectedQuote.id ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied For Sharing
                </>
              ) : canUseNativeShare ? (
                <>
                  <Share2 className="h-4 w-4" />
                  Share Quote
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Quote
                </>
              )}
            </button>
          ) : null
        }
      >
        {selectedQuote ? (
          <div className="not-prose space-y-6">
            <div className="rounded-[24px] border border-[#1C2526]/8 bg-[#FFF8E8] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                Featured Quote
              </p>
              <blockquote className="mt-4 text-xl leading-8 text-[#1C2526] sm:text-2xl sm:leading-9">
                "{selectedQuote.text}"
              </blockquote>
            </div>

            <div className="rounded-[24px] border border-[#1C2526]/8 bg-white p-4 shadow-[0_10px_30px_rgba(28,37,38,0.05)] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]">
                Quote Details
              </p>
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#1C2526]/78">
                {selectedQuote.details}
              </p>
            </div>
          </div>
        ) : null}
      </ContentDetailsDialog>
    </section>
  );
}
