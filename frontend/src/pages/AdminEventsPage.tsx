import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvents, createEvent, updateEvent, deleteEvent, uploadEventImage } from "../api/events";
import { Navbar } from "../components/Navbar";
import type { Event } from "../types";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  venue: "",
  location: "",
  ticket_price: 0,
  available_seats: 0,
};

export function AdminEventsPage() {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useQuery({ queryKey: ["events"], queryFn: () => getEvents() });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: async (newEvent) => {
      if (imageFile) {
        await uploadEventImage(newEvent.id, imageFile);
      }
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: () => setError("Failed to create event. Check all fields."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) => updateEvent(id, data),
    onSuccess: async (updatedEvent) => {
      if (imageFile) {
        await uploadEventImage(updatedEvent.id, imageFile);
      }
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    },
    onError: () => setError("Failed to update event."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description ?? "",
      category: event.category ?? "",
      date: event.date,
      time: event.time?.slice(0, 5),
      venue: event.venue ?? "",
      location: event.location ?? "",
      ticket_price: event.ticket_price,
      available_seats: event.available_seats,
    });
    setShowForm(true);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      ticket_price: Number(form.ticket_price),
      available_seats: Number(form.available_seats),
      time: form.time.length === 5 ? `${form.time}:00` : form.time,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload as any);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-text">Manage Events</h1>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="bg-gold hover:bg-gold-light text-bg font-semibold px-4 py-1.5 rounded-full transition-colors text-sm"
          >
            {showForm ? "Cancel" : "+ New Event"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="font-display text-lg font-semibold text-text">
              {editingId ? "Edit Event" : "Create Event"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Music, Sports, Conference..."
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Time</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Venue</label>
                <input
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Location / City</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Ticket Price</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.ticket_price}
                  onChange={(e) => setForm({ ...form, ticket_price: Number(e.target.value) })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">Available Seats</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.available_seats}
                  onChange={(e) => setForm({ ...form, available_seats: Number(e.target.value) })}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1.5">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1.5">Event Image</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold file:text-bg file:font-medium file:text-sm"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="bg-gold hover:bg-gold-light text-bg font-semibold px-5 py-2 rounded-full transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : editingId ? "Update Event" : "Create Event"}
            </button>
          </form>
        )}

        {isLoading && <p className="text-text-muted">Loading events...</p>}

        <div className="space-y-3">
          {events?.map((event) => (
            <div key={event.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg shrink-0">
                {event.image_url ? (
                  <img src={`http://127.0.0.1:8000${event.image_url}`} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text font-medium truncate">{event.title}</p>
                <p className="text-text-muted text-xs">
                  {event.date} · Rs. {event.ticket_price} · {event.available_seats} seats
                </p>
              </div>
              <button
                onClick={() => startEdit(event)}
                className="text-sm text-gold hover:text-gold-light px-3 py-1.5"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(event.id)}
                className="text-sm text-red-400 hover:text-red-300 px-2.5 py-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}