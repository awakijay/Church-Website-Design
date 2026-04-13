import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ContentDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow: string;
  title: string;
  summary?: string;
  meta?: Array<{ label: string; value: string }>;
  children: ReactNode;
  footer?: ReactNode;
};

export function ContentDetailsDialog({
  open,
  onOpenChange,
  eyebrow,
  title,
  summary,
  meta = [],
  children,
  footer,
}: ContentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-[calc(100%-1rem)] overflow-y-auto rounded-[24px] border-[#1C2526]/10 bg-[#FFFDF8] p-0 shadow-[0_30px_90px_rgba(28,37,38,0.18)] sm:max-w-3xl sm:rounded-[28px]">
        <div className="border-b border-[#1C2526]/8 bg-gradient-to-br from-[#FFF8E8] via-white to-[#FFF4E8] px-4 py-5 pr-14 sm:px-6 sm:py-7 md:px-8 md:py-8">
          <DialogHeader className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B00]">
              {eyebrow}
            </p>
            <DialogTitle className="mt-3 text-2xl text-[#1C2526] sm:text-3xl">
              {title}
            </DialogTitle>
            {summary ? (
              <DialogDescription className="mt-3 max-w-2xl text-base leading-7 text-[#1C2526]/68">
                {summary}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {meta.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {meta.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-2xl border border-[#1C2526]/8 bg-white/75 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1C2526]/45">
                    {item.label}
                  </p>
                  <p className="mt-2 break-words text-sm text-[#1C2526]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
          <div className="prose prose-neutral max-w-none whitespace-pre-line text-[#1C2526]/78">
            {children}
          </div>
          {footer ? <div className="mt-6 sm:mt-8">{footer}</div> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
