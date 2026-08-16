import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/events";
import { Navbar } from "../components/Navbar";
import { EventCard } from "../components/EventCard";
import { motion } from "framer-motion";
import heroImage from "../assets/images/hero-bg.jpg";
import heroVideo from "../assets/videos/concert-highlight.mp4";
import { FAQSection } from "../components/FAQSection";
import { Footer } from "../components/Footer";

const CATEGORIES = [
  "All",
  "Music",
  "Sports",
  "Conference",
  "Theatre",
  "Workshop",
];

export function LandingPage() {
  const [category, setCategory] = useState("All");
  const [search,] = useState("");

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });

  const filteredEvents = events?.filter((e) => {
    const matchesCategory = category === "All" || e.category === category;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* Hero */}
      <section id = "home" className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <motion.img
            src={heroImage}
            alt=""
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/85 to-bg/40" />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-bg/50" />

          {/* Animated ambient glows */}
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, 30, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-gold text-sm font-medium tracking-wide mb-4 border border-gold/30 rounded-full px-4 py-1"
            >
              Find your next experience
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-text leading-[1.1] mb-6"
            >
              Every event, <span className="italic text-gold">one place.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-muted text-lg mb-8 max-w-lg"
            >
              Discover concerts, conferences, and shows near you. Book tickets in seconds and never miss a moment.
            </motion.p>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            >
            <a
                href="#events"
                className="inline-block bg-gold hover:bg-gold-light text-bg font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:shadow-[0_0_20px_rgba(240,165,0,0.3)]"
            >
                Browse Events {"→"}
            </a>
            </motion.div>

          </div>
        </div>
      </section>

    {/* About Us */}
      <section id="about" className="max-w-7xl mx-auto pt-40 px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-gold text-xs font-medium tracking-wide mb-3 border border-gold/30 rounded-full px-3 py-1">
              About Evenue
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text mb-4 leading-tight">
              Built for people who <span className="italic text-gold">show up.</span>
            </h2>
            <p className="text-text-muted leading-relaxed mb-4">
              Evenue connects you with concerts, conferences, and shows happening around you. No clutter, no
              guesswork. Browse, book, and get in, all from one place.
            </p>
            <p className="text-text-muted leading-relaxed">
              Whether you're organizing an event or just looking for your next night out, we've built the tools
              to make it simple.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Live Events", value: "500+" },
              { label: "Happy Attendees", value: "10K+" },
              { label: "Cities Covered", value: "5+" },
              { label: "Event Organizers", value: "150+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface border border-border rounded-2xl p-6 text-center">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-gold mb-1">{stat.value}</p>
                <p className="text-text-muted text-xs">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Video Highlight Section */}
      <section className="relative border-b border-border bg-bg pt-40 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-125 h-75 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <span className="inline-block text-gold text-xs font-medium tracking-wide mb-3 border border-gold/30 rounded-full px-3 py-1">
              Live moments
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-text mb-3 leading-tight py-1">
              Feel the <span className="italic text-gold">energy</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto">
              From packed stadiums to intimate stages. Every event on Evenue comes alive.
            </p>
          </motion.div>
        </div>

        {/* Full-bleed video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-72 sm:h-105 lg:h-130"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-bg/40 pointer-events-none" />
        </motion.div>
      </section>

      {/* Events */}
    <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 sm:pt-28 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <h2 className="font-display text-2xl font-semibold text-text">Upcoming Events</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  category === cat
                    ? "bg-gold text-bg border-gold font-medium"
                    : "border-border text-text-muted hover:border-gold/50 hover:text-text"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-surface border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-text-muted text-center py-20">Couldn't load events. Try refreshing.</p>
        )}

        {filteredEvents && filteredEvents.length === 0 && (
          <p className="text-text-muted text-center py-20">No events match your search.</p>
        )}

        {filteredEvents && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
        <FAQSection />
        <Footer />
    </div>
  );
}
