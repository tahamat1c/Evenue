import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { AdminEventsPage } from "./pages/AdminEventsPage";
import { AdminBookingsPage } from "./pages/AdminBookingsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ChatbotWidget } from "./components/ChatbotWidget";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute adminOnly>
              <AdminEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ChatbotWidget />
    </>
  );
}

export default App;