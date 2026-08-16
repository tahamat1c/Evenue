import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { getAllBookings } from "../api/booking";
import { Navbar } from "../components/Navbar";

const GOLD = "#F0A500";
const COLORS = [GOLD, "#8b8b95"];

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface border border-border rounded-2xl p-5"
    >
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-text">{value}</p>
    </motion.div>
  );
}

export function AdminBookingsPage() {
  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["allBookings"],
    queryFn: getAllBookings,
  });

  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "cancelled">("all");

  const filtered = bookings?.filter((b) =>
    statusFilter === "all" ? true : b.booking_status === statusFilter
  );

  const totalRevenue = bookings
    ?.filter((b) => b.booking_status === "confirmed")
    .reduce((sum, b) => sum + b.total_price, 0) ?? 0;

  const confirmedCount = bookings?.filter((b) => b.booking_status === "confirmed").length ?? 0;
  const cancelledCount = bookings?.filter((b) => b.booking_status === "cancelled").length ?? 0;

  const topEvents = useMemo(() => {
    if (!bookings) return [];
    const map = new Map<string, number>();
    bookings
      .filter((b) => b.booking_status === "confirmed")
      .forEach((b) => {
        map.set(b.event_title, (map.get(b.event_title) ?? 0) + b.number_of_tickets);
      });
    return Array.from(map.entries())
      .map(([name, tickets]) => ({
        name: name.length > 12 ? name.slice(0, 12) + "…" : name,
        fullName: name,
        tickets,
      }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5);
  }, [bookings]);

  const statusPieData = [
    { name: "Confirmed", value: confirmedCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-semibold text-text mb-2">All Bookings</h1>
        <p className="text-text-muted text-sm mb-8">Overview of bookings and revenue across all events.</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Bookings" value={String(bookings?.length ?? 0)} delay={0} />
          <StatCard label="Confirmed" value={String(confirmedCount)} delay={0.05} />
          <StatCard label="Cancelled" value={String(cancelledCount)} delay={0.1} />
          <StatCard label="Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} delay={0.15} />
        </div>

        {/* Charts */}
        {!isLoading && bookings && bookings.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5"
            >
              <p className="text-text text-sm font-medium mb-4">Top Events by Tickets Sold</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topEvents} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#A0A0AA", fontSize: 11 }} interval={0} />
                  <YAxis tick={{ fill: "#A0A0AA", fontSize: 11 }} allowDecimals={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "#15151F", border: "1px solid #2A2A35", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#F5F5F5" }}
                    cursor={{ fill: "rgba(240,165,0,0.06)" }}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                  />
                  <Bar dataKey="tickets" name="Tickets Sold" fill={GOLD} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <p className="text-text text-sm font-medium mb-4">Booking Status</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {statusPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#15151F", border: "1px solid #2A2A35", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} /> Confirmed
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b8b95]" /> Cancelled
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter + Table */}
        <div className="flex gap-2 mb-6">
          {(["all", "confirmed", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-sm px-3.5 py-1 rounded-full border transition-colors capitalize ${
                statusFilter === status
                  ? "bg-gold text-bg border-gold font-medium"
                  : "border-border text-text-muted hover:border-gold/50 hover:text-text"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-text-muted">Loading bookings...</p>}
        {isError && <p className="text-text-muted">Couldn't load bookings.</p>}

        {filtered && filtered.length === 0 && (
          <p className="text-text-muted text-center py-16">No bookings found.</p>
        )}

        {filtered && filtered.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-muted text-left">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Tickets</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-text font-medium">{b.user_name}</p>
                      <p className="text-text-muted text-xs">{b.user_email}</p>
                    </td>
                    <td className="px-4 py-3 text-text">{b.event_title}</td>
                    <td className="px-4 py-3 text-text-muted">{b.number_of_tickets}</td>
                    <td className="px-4 py-3 text-text">Rs. {b.total_price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(b.booking_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-3 py-0.5 rounded-full ${
                          b.booking_status === "cancelled"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}