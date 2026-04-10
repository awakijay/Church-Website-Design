import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import { ArrowRight, Calendar, Play } from "lucide-react";
import { prefillContactMessage } from "../lib/contactActions";
import { useChurchContent } from "../content/ChurchContentContext";
import { SermonItem } from "../content/churchContent";
import { ContentDetailsDialog } from "./ContentDetailsDialog";

export function Sermons() {
  const { ref, inView } = useInView();
  const {
    content: { sermons },
  } = useChurchContent();
  const [selectedSermon, setSelectedSermon] = useState<SermonItem | null>(null);

  return (
    <section
      id="sermons"
      ref={ref}
      className="scroll-mt-28 bg-[#FFF8E8] px-4 py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#1C2526] mb-4">
            Latest Sermons
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            Listen to recent messages from our Sunday services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {sermons.map((sermon, index) => (
            <motion.button
              key={sermon.id}
              type="button"
              onClick={() => setSelectedSermon(sermon)}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-left bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>

              <div className="text-sm text-[#FF6B00] mb-2">{sermon.series}</div>
              <h3 className="text-2xl text-[#1C2526] mb-3">{sermon.title}</h3>
              <p className="text-[#1C2526]/70 mb-4">{sermon.speaker}</p>
              <p className="mb-5 text-[#1C2526]/65">{sermon.summary}</p>

              <div className="flex items-center text-sm text-[#1C2526]/60">
                <Calendar className="w-4 h-4 mr-2" />
                {sermon.date}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B00]">
                Open Sermon Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              prefillContactMessage(
                "Hello, I would love access to the full sermon archive and recent messages.",
              );
            }}
            className="inline-block bg-[#FF6B00] px-8 py-3 text-white transition-colors hover:bg-[#FF6B00]/90"
          >
            Request Sermon Archive
          </a>
        </motion.div>

        <ContentDetailsDialog
          open={Boolean(selectedSermon)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedSermon(null);
            }
          }}
          eyebrow="Sermon Details"
          title={selectedSermon?.title ?? ""}
          summary={selectedSermon?.summary}
          meta={
            selectedSermon
              ? [
                  { label: "Speaker", value: selectedSermon.speaker },
                  { label: "Series", value: selectedSermon.series },
                  { label: "Date", value: selectedSermon.date },
                ]
              : []
          }
        >
          {selectedSermon?.details ?? ""}
        </ContentDetailsDialog>
      </div>
    </section>
  );
}
