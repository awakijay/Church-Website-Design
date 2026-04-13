import { useState } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { prefillContactMessage } from "../lib/contactActions";
import { useChurchContent } from "../content/ChurchContentContext";
import { EventItem } from "../content/churchContent";
import { ContentDetailsDialog } from "./ContentDetailsDialog";

export function Events() {
  const { ref, inView } = useInView();
  const {
    content: { events },
  } = useChurchContent();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <section
      id="events"
      ref={ref}
      className="scroll-mt-28 bg-white px-4 py-16 sm:px-5 md:py-24 lg:px-6 lg:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-[#1C2526] mb-4">
            Upcoming Events
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            Join us for these special gatherings and activities
          </p>
        </motion.div>

        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-[30px] border border-[#1C2526]/8 border-l-4 border-l-[#FF6B00] bg-gradient-to-r from-[#FFF8E8] to-white p-5 shadow-[0_16px_40px_rgba(28,37,38,0.06)] transition-shadow hover:shadow-xl sm:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 text-left"
                >
                  <h3 className="text-2xl text-[#1C2526] mb-4">{event.title}</h3>
                  <p className="text-[#1C2526]/70 mb-4">{event.description}</p>

                  <div className="flex flex-col gap-2 text-[#1C2526]/60">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#FF6B00]" />
                      {event.location}
                    </div>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#FF6B00]">
                    Open Full Details
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    prefillContactMessage(
                      `Hello, I would like to register for "${event.title}" on ${event.date}. Please share the next steps.`,
                    )
                  }
                  className="self-start whitespace-nowrap rounded-full bg-[#FF6B00] px-6 py-3 text-white shadow-[0_16px_30px_rgba(255,107,0,0.18)] transition-colors hover:bg-[#FF6B00]/90"
                >
                  Register
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <ContentDetailsDialog
          open={Boolean(selectedEvent)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedEvent(null);
            }
          }}
          eyebrow="Event Details"
          title={selectedEvent?.title ?? ""}
          summary={selectedEvent?.description}
          meta={
            selectedEvent
              ? [
                  { label: "Date", value: selectedEvent.date },
                  { label: "Time", value: selectedEvent.time },
                  { label: "Location", value: selectedEvent.location },
                ]
              : []
          }
          footer={
            selectedEvent ? (
              <button
                type="button"
                onClick={() =>
                  prefillContactMessage(
                    `Hello, I would like to register for "${selectedEvent.title}" on ${selectedEvent.date}. Please share the next steps.`,
                  )
                }
                className="rounded-full bg-[#FF6B00] px-6 py-3 text-white transition-colors hover:bg-[#FF6B00]/90"
              >
                Register For This Event
              </button>
            ) : null
          }
        >
          {selectedEvent?.details ?? ""}
        </ContentDetailsDialog>
      </div>
    </section>
  );
}
