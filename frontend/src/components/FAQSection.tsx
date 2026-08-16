import { useState } from "react";
import { motion } from "framer-motion";

const FAQS = [
  {
    q: "How do I book a ticket?",
    a: "Browse events on the home page, click any event to see details, choose your ticket quantity, and hit Book Now. You'll need an account to complete the booking.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes. Go to My Bookings, find your booking, and click Cancel. Your seats are released back immediately.",
  },
  {
    q: "How do I know if an event is sold out?",
    a: "Sold-out events are clearly marked on their card and details page, and booking is disabled automatically.",
  },
  {
    q: "Is there a fee for using Evenue?",
    a: "No, browsing and booking through Evenue is free. You only pay the ticket price set by the event organizer.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-text font-medium text-sm sm:text-base pr-4">{q}</span>
        <span className={`text-gold text-xl shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-text-muted text-sm leading-relaxed pb-5 pr-8">{a}</p>
      </motion.div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text mb-2">
          Frequently asked <span className="italic text-gold">questions</span>
        </h2>
        <p className="text-text-muted text-sm">Everything you need to know before booking.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {FAQS.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </motion.div>
    </section>
  );
}