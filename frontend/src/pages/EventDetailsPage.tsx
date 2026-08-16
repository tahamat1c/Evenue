import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEventById } from "../api/events";
import { createBooking } from "../api/booking";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { AuthModal } from "../components/AuthModal";

export function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [tickets, setTickets] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(Number(id)),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setSuccessMsg("Booking confirmed! Check My Bookings for details.");
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      setTickets(1);
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.detail || "Booking failed. Try again.");
      setSuccessMsg("");
    },
  });

  const handleBookNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setErrorMsg("");
    bookingMutation.mutate({ event_id: Number(id), number_of_tickets: tickets });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          <div className="h-80 bg-surface border border-border rounded-2xl mb-8" />
          <div className="h-8 w-2/3 bg-surface rounded mb-4" />
          <div className="h-4 w-1/3 bg-surface rounded" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-text-muted mb-4">Couldn't find this event.</p>
          <button onClick={() => navigate("/")} className="text-gold hover:text-gold-light">
            ← Back to events
          </button>
        </div>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const soldOut = event.available_seats === 0;
  const totalPrice = event.ticket_price * tickets;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate("/")} className="text-text-muted hover:text-text text-sm mb-6 inline-flex items-center gap-1">
          ← Back to events
        </button>

        {/* Image */}
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-surface border border-border mb-8">
          {event.image_url ? (
            <img
              src={`http://127.0.0.1:8000${event.image_url}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              No image available
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent" />
          {event.category && (
            <span className="absolute top-4 left-4 bg-bg/80 backdrop-blur-sm text-gold text-xs font-medium px-3 py-1 rounded-full border border-gold/30">
              {event.category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-text mb-3">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-muted text-sm mb-6">
              <span>📅 {formattedDate} · {event.time?.slice(0, 5)}</span>
              {event.venue && <span>📍 {event.venue}{event.location ? `, ${event.location}` : ""}</span>}
            </div>

            {event.description && (
              <div className="border-t border-border pt-6">
                <h2 className="font-display text-lg font-semibold text-text mb-2">About this event</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-5 sticky top-24">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-text-muted text-sm">Price per ticket</span>
                <span className="text-gold font-display text-xl font-semibold">
                  {event.ticket_price > 0 ? `Rs. ${event.ticket_price.toLocaleString()}` : "Free"}
                </span>
              </div>
              <p className="text-text-muted text-xs mb-5">
                {soldOut ? "Sold out" : `${event.available_seats} seats available`}
              </p>

              {!soldOut && (
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-text-muted">Tickets</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setTickets((t) => Math.max(1, t - 1))}
                      className="w-7 h-7 rounded-full border border-border text-text hover:border-gold transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="text-text font-medium w-5 text-center text-sm">{tickets}</span>
                    <button
                      onClick={() => setTickets((t) => Math.min(event.available_seats, t + 1))}
                      className="w-7 h-7 rounded-full border border-border text-text hover:border-gold transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {!soldOut && (
                <div className="flex items-center justify-between mb-5 pt-3 border-t border-border">
                  <span className="text-text text-sm font-medium">Total</span>
                  <span className="text-text font-display text-lg font-semibold">
                    {totalPrice > 0 ? `Rs. ${totalPrice.toLocaleString()}` : "Free"}
                  </span>
                </div>
              )}

              {successMsg && <p className="text-green-400 text-xs mb-3">{successMsg}</p>}
              {errorMsg && <p className="text-red-400 text-xs mb-3">{errorMsg}</p>}

              <button
                onClick={handleBookNow}
                disabled={soldOut || bookingMutation.isPending}
                className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-2.5 rounded-full text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {soldOut ? "Sold Out" : bookingMutation.isPending ? "Booking..." : user ? "Book Now" : "Login to Book"}
              </button>
            </div>
          </div>



        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}