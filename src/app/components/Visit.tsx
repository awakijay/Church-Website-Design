import { motion } from "motion/react";
import { useInView } from "./hooks/useInView";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { activityGallery } from "../content/activityGallery";

const weeklyActivities = [
  {
    day: "Mon",
    title: "Night Prayers",
    time: "7:00 PM - 7:30 PM",
    link: "https://chat.whatsapp.com/EUVPvLQ8r72Ag8YpfhK44Y",
    note: "Online on WhatsApp",
  },
  {
    day: "Tues",
    title: "House Fellowship",
    time: "5:00 PM",
  },
  {
    day: "Wed",
    title: "Reaching Out, Follow-Up and Welfare",
    time: "All-Day",
  },
  {
    day: "Thurs",
    title: "Choir Rehearsal",
    time: "4:00 PM",
  },
  {
    day: "Fri",
    title: "The King's Elites",
    time: "4:30 PM - 7:00 PM",
  },
  {
    day: "Sat",
    title: "Sanctuary Keeping, Welfare, Follow-Up, Workers Meeting",
    time: "10:00 AM - 7:00 PM",
  },
  {
    day: "Sun",
    title: "Church Service",
    time: "8:00 AM - 11:30 AM",
  },
];

export function Visit() {
  const { ref, inView } = useInView();
  const visitPhoto = activityGallery[11] ?? activityGallery.at(-1);
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=In+His+Name+Bible+Church,+2+Church+Rd,+Sunlight+Estate+Gate,+Incarnate+Rd+(Off+Location+Rd),+Umuebulu+2,+Rivers,+NG";

  return (
    <section
      id="visit"
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
            Plan Your Visit
          </h2>
          <div className="h-1 w-24 bg-[#FF6B00] mx-auto mb-6" />
          <p className="text-lg text-[#1C2526]/70 max-w-2xl mx-auto">
            We can't wait to meet you! Here's what you need to know
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ImageWithFallback
              src={visitPhoto?.src}
              alt={visitPhoto?.alt ?? "Church members gathered together"}
              className="h-[560px] w-full rounded-[36px] object-cover shadow-[0_24px_60px_rgba(28,37,38,0.18)]"
              style={{ objectPosition: visitPhoto?.objectPosition }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl text-[#1C2526] mb-6">Church Activities</h3>
              <div className="space-y-4">
                {weeklyActivities.map((activity) => (
                  <div
                    key={`${activity.day}-${activity.title}`}
                    className="flex items-start gap-4 rounded-[24px] bg-white p-4 shadow-[0_14px_35px_rgba(28,37,38,0.07)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E8] text-sm font-semibold text-[#FF6B00]">
                      {activity.day}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[#1C2526]">{activity.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-[#1C2526]/70">
                        <Clock className="h-4 w-4 text-[#FF6B00]" />
                        <span>{activity.time}</span>
                      </div>
                      {activity.note ? (
                        <div className="mt-2 text-sm text-[#1C2526]/70">
                          {activity.note}
                          {activity.link ? (
                            <a
                              href={activity.link}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2 inline-flex items-center gap-1 font-medium text-[#25D366] transition-colors hover:text-[#1fa855]"
                            >
                              Join on WhatsApp
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-[#1C2526] mb-6">Location & Contact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#FF6B00] flex-shrink-0 mt-1" />
                  <div className="text-[#1C2526]/80">
                    In His Name Bible Church<br />
                    2 Church Rd, Sunlight Estate Gate<br />
                    Incarnate Rd (Off Location Rd)<br />
                    Umuebulu 2, Rivers, NG
                  </div>
                </div>
                <a
                  href="tel:+2347077423125"
                  className="flex items-start gap-4 text-[#1C2526]/80 transition-colors hover:text-[#FF6B00]"
                >
                  <Phone className="mt-1 h-6 w-6 shrink-0 text-[#FF6B00]" />
                  <span>+234 707 742 3125</span>
                </a>
                <a
                  href="mailto:stewardjornsen@gmail.com"
                  className="flex items-start gap-4 text-[#1C2526]/80 transition-colors hover:text-[#FF6B00]"
                >
                  <Mail className="mt-1 h-6 w-6 shrink-0 text-[#FF6B00]" />
                  <span>stewardjornsen@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#FF6B00] text-white px-8 py-3 hover:bg-[#FF6B00]/90 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
