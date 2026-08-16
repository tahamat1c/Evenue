import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Event } from "../types";

export function EventCard({ event }: { event: Event }) {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:border-gold/50 transition-colors duration-300"
      >
        <div className="relative h-48 overflow-hidden bg-bg">
          {event.image_url ? (
            <img
              src={`http://127.0.0.1:8000${event.image_url}`}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
              No image
            </div>
          )}
          {event.category && (
            <span className="absolute top-3 left-3 bg-bg/80 backdrop-blur-sm text-gold text-xs font-medium px-3 py-1 rounded-full border border-gold/30">
              {event.category}
            </span>
          )}
          {event.available_seats === 0 && (
            <span className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-medium px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-text mb-1 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-text-muted text-sm mb-3">
            {formattedDate} {event.venue ? `· ${event.venue}` : ""}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gold font-semibold">
              {event.ticket_price > 0 ? `Rs. ${event.ticket_price.toLocaleString()}` : "Free"}
            </span>
            <span className="text-text-muted text-xs">
              {event.available_seats} seats left
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}