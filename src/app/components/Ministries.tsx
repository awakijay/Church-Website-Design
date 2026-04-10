import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import {
  ArrowRight,
  Baby,
  BookHeart,
  Globe,
  Music,
  Sparkles,
  Users,
} from "lucide-react";
import { useChurchContent } from "../content/ChurchContentContext";
import { MinistryIconName, MinistryItem } from "../content/churchContent";
import { ContentDetailsDialog } from "./ContentDetailsDialog";

const ministryIcons: Record<MinistryIconName, typeof Users> = {
  users: Users,
  baby: Baby,
  sparkles: Sparkles,
  music: Music,
  globe: Globe,
  "book-heart": BookHeart,
};

export function Ministries() {
  const { ref, inView } = useInView();
  const {
    content: { ministries },
  } = useChurchContent();
  const [selectedMinistry, setSelectedMinistry] = useState<MinistryItem | null>(null);

  return (
    <section
      id="ministries"
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
            Our Ministries
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            Discover ways to grow, serve, and connect through our various ministries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <motion.button
              key={ministry.id}
              type="button"
              onClick={() => setSelectedMinistry(ministry)}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-left bg-gradient-to-br from-[#FFF8E8] to-white p-8 border border-[#FF6B00]/20 hover:border-[#FF6B00] hover:shadow-xl transition-all hover:-translate-y-2"
            >
              {(() => {
                const Icon = ministryIcons[ministry.icon] ?? Users;

                return (
                  <div className="w-16 h-16 bg-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                );
              })()}
              <h3 className="text-2xl text-[#1C2526] mb-3">{ministry.title}</h3>
              <p className="text-[#1C2526]/70 leading-relaxed">
                {ministry.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B00]">
                View Full Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>

        <ContentDetailsDialog
          open={Boolean(selectedMinistry)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedMinistry(null);
            }
          }}
          eyebrow="Ministry Details"
          title={selectedMinistry?.title ?? ""}
          summary={selectedMinistry?.description}
        >
          {selectedMinistry?.details ?? ""}
        </ContentDetailsDialog>
      </div>
    </section>
  );
}
