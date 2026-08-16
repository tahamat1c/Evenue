export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  date: string;
  time: string;
  venue: string | null;
  location: string | null;
  ticket_price: number;
  available_seats: number;
  image_url: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  event_id: number;
  number_of_tickets: number;
  total_price: number;
  booking_status: "confirmed" | "cancelled";
  booking_date: string;
}

export interface AdminBooking extends Booking {
  user_name: string;
  user_email: string;
  event_title: string;
}

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
}