import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  HandCoins,
  ShieldAlert,
} from "lucide-react";
import { prefillContactMessage } from "../lib/contactActions";

const DONATION_ACCOUNT_NUMBER = "5545084785";

type DonationSectionProps = {
  compact?: boolean;
};

export function DonationSection({ compact = false }: DonationSectionProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyAccountNumber() {
    try {
      await navigator.clipboard.writeText(DONATION_ACCOUNT_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures and let the number remain visible for manual copy.
    }
  }

  return (
    <div
      id="give"
      className="scroll-mt-28 rounded-[32px] border border-[#FF6B00]/15 bg-white p-6 shadow-[0_18px_50px_rgba(28,37,38,0.08)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#1C2526]/8 pb-5">
        <div className="flex items-center gap-3">
          <a
            href="./"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#1C2526]/10 text-[#1A5D8F] transition-colors hover:border-[#1A5D8F]/30"
            aria-label="Back to website"
          >
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#1A5D8F]/75">
              Giving
            </p>
            <h2 className="text-2xl text-[#1C2526]">Invest in the Kingdom</h2>
          </div>
        </div>
      </div>

      <div className="px-1 py-8 text-center">
        <p
          className={`font-semibold text-[#1A5D8F] ${
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
          }`}
        >
          Invest in the <span className="text-[#FF6B00]">Kingdom</span>
        </p>
        <p className="mx-auto mt-3 max-w-xl text-[#1C2526]/65">
          Your generous giving helps us reach more souls and advance God&apos;s
          kingdom.
        </p>
        <button
          type="button"
          onClick={() =>
            prefillContactMessage(
              "Hello, I would like to support the church's projects and would appreciate more giving information.",
            )
          }
          className="mt-6 inline-flex items-center justify-center rounded-xl border-2 border-[#1A5D8F] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#1A5D8F] transition-colors hover:bg-[#1A5D8F] hover:text-white"
        >
          Support Our Projects
        </button>
      </div>

      <div className="rounded-[28px] bg-[#FBFDFF] p-5 shadow-[0_16px_40px_rgba(28,37,38,0.06)]">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1184CC] text-white shadow-[0_12px_25px_rgba(17,132,204,0.22)]">
            <HandCoins className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-[#1A5D8F]">Bank Transfer</h3>
            <p className="mt-1 text-[#1C2526]/55">
              Transfer directly to our account
            </p>
          </div>
        </div>

        <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-3"}`}>
          <div className="rounded-3xl bg-[#F3F7FB] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1A5D8F]/45">
              Account Name
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight text-[#1A5D8F]">
              In His Name Bible Church1
            </p>
          </div>

          <div className="rounded-3xl bg-[#F3F7FB] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1A5D8F]/45">
              Bank
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight text-[#1A5D8F]">
              Moniepoint MFB
            </p>
          </div>

          <div className="rounded-3xl border border-[#FF6B00]/25 bg-[#FFF9F1] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF6B00]/80">
                  Account Number
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-[0.08em] text-[#1A5D8F]">
                  {DONATION_ACCOUNT_NUMBER}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyAccountNumber}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#FF6B00]/20 bg-white text-[#FF6B00] transition-colors hover:bg-[#FF6B00] hover:text-white"
                aria-label="Copy account number"
                title="Copy account number"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#1A5D8F]/10 bg-[#F5FAFF] px-4 py-3 text-sm text-[#1C2526]/70">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#1A5D8F]" />
        <p>
          For receipts, project sponsorship, or giving questions, use the
          contact form and we&apos;ll follow up with you directly.
        </p>
      </div>

      <div className="mt-6">
        <a
          href="./#contact"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1A5D8F] transition-colors hover:text-[#FF6B00]"
        >
          Contact the church about giving
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
