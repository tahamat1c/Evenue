import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, cancelBooking } from "../api/booking";
import { getEventById } from "../api/events";
import { Navbar } from "../components/Navbar";
import type { Booking } from "../types";

function BookingRow({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { data: event } = useQuery({
    queryKey: ["event", booking.event_id],
    queryFn: () => getEventById(booking.event_id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["event", booking.event_id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const isCancelled = booking.booking_status === "cancelled";
  const formattedDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-bg shrink-0">
        {event?.image_url ? (
          <img
            src={`http://127.0.0.1:8000${event.image_url}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No image</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link to={`/events/${booking.event_id}`} className="font-display text-lg font-semibold text-text hover:text-gold transition-colors">
          {event?.title ?? "Loading..."}
        </Link>
        <p className="text-text-muted text-sm mt-1">
          {booking.number_of_tickets} ticket{booking.number_of_tickets > 1 ? "s" : ""} · Rs. {booking.total_price.toLocaleString()} · Booked {formattedDate}
        </p>
        <span
          className={`inline-block mt-2 text-xs font-medium px-3 py-0.5 rounded-full ${
            isCancelled ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
          }`}
        >
          {isCancelled ? "Cancelled" : "Confirmed"}
        </span>
      </div>

      {!isCancelled && (
        <div className="shrink-0">
          {confirmCancel ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="text-sm text-text-muted hover:text-text px-3 py-1.5"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmCancel(true)}
              className="text-sm border border-border hover:border-red-400 hover:text-red-400 text-text-muted px-4 py-1.5 rounded-full transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function MyBookingsPage() {
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["myBookings"],
    queryFn: getMyBookings,
  });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-text mb-8">My Bookings</h1>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-surface border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {isError && <p className="text-text-muted">Couldn't load your bookings.</p>}

        {bookings && bookings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-muted mb-4">You haven't booked any events yet.</p>
            <Link to="/" className="text-gold hover:text-gold-light font-medium">
              Browse events →
            </Link>
          </div>
        )}

        {bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}