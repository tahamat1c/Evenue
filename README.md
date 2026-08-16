# Evenue — Event Booking Platform

A modern full-stack event booking platform that allows users to discover events, book tickets, manage their bookings, and interact with an AI-powered assistant for event-related queries.
Evenue also provides an admin dashboard for managing events, monitoring bookings, and viewing platform analytics.

---

## Features

### User Features

- Browse and search available events
- Filter events by category and location
- View detailed event information
- Check ticket prices and available seats
- Book tickets with real-time seat availability validation
- View personal booking history
- Cancel bookings
- Interact with an AI assistant for:
  - Event information
  - Ticket pricing
  - Event availability
  - Venue and location details
  - Personal booking information for authenticated users
- Responsive interface for desktop, tablet, and mobile

### Admin Features

- Create new events
- Update existing events
- Delete events
- Upload event images
- View all platform bookings
- Monitor booking details and user information
- View dashboard analytics including:
  - Total bookings
  - Total revenue
  - Booking status breakdown
  - Top events by tickets sold
- Interactive analytics charts powered by Recharts

### AI Assistant

The platform includes an AI-powered chatbot built with the Groq API and Llama 3.3 70B.

The chatbot can:

- Answer questions about available events
- Provide event details and pricing
- Check event availability
- Assist users in finding suitable events
- Access authenticated users' booking information
- Use backend tools to retrieve real-time platform data

The chatbot can also be used without authentication for general event-related queries.

---

## Authentication & Security

- JWT-based authentication
- Role-based access control
- User and Admin roles
- Secure password hashing with bcrypt
- Protected admin endpoints
- OAuth2 password flow
- Token-based API authorization

Newly registered users are assigned the `user` role by default.

For development purposes, an administrator can currently be promoted manually through PostgreSQL:
```
sql
UPDATE users
SET role = 'admin'
WHERE email = 'your_email@example.com';
```
```
Tech Stack
Backend
FastAPI — REST API framework
Python — Backend programming language
PostgreSQL — Relational database
SQLAlchemy — ORM
Pydantic — Data validation and schemas
JWT / python-jose — Authentication
Passlib + bcrypt — Password hashing
Groq API — AI inference
Llama 3.3 70B — Chatbot LLM
Frontend
React
TypeScript
Vite
Tailwind CSS
TanStack React Query — Data fetching and caching
React Router — Client-side routing
Framer Motion — UI animations
Recharts — Analytics and charts
Axios — API communication
```
```
📁 Project Structure
Evenue/
│
├── backend/
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── ai/             # LLM integration and AI tools
│   │   ├── core/           # Configuration, security & dependencies
│   │   ├── database/       # Database connection and setup
│   │   └── main.py         # FastAPI application entry point
│   │
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # Authentication context
│   │   └── types/          # TypeScript interfaces
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```
Getting Started
Prerequisites

Make sure the following are installed:

Python 3.10+
Node.js
PostgreSQL
Git
Backend Setup
1. Clone the repository
git clone https://github.com/tahamat1c/Evenue
cd Evenue
2. Navigate to the backend
cd backend
3. Create a virtual environment

Windows:

python -m venv venv

Activate it:

venv\Scripts\activate

For PowerShell:

.\venv\Scripts\Activate.ps1
4. Install dependencies
pip install -r requirements.txt
5. Configure environment variables

Create a .env file inside the backend folder:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:yyyy/event_booking_db
SECRET_KEY=your-secret-key
ALGORITHM=YYYYY
ACCESS_TOKEN_EXPIRE_MINUTES=60
GROQ_API_KEY=your-groq-api-key

6. Create the PostgreSQL database

Open PostgreSQL and run:

CREATE DATABASE event_booking_db;
7. Start the FastAPI server

From the backend directory:
uvicorn app.main:app --reload

💻 Frontend Setup

Open another terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

```
API Overview
Endpoint	Method	Access	Description
/auth/register	POST	Public	Register a new user
/auth/login	POST	Public	Login and receive JWT
/auth/me	GET	Authenticated	Get current user
/events/	GET	Public	List available events
/events/{id}	GET	Public	Get event details
/events/	POST	Admin	Create an event
/events/{id}	PUT	Admin	Update an event
/events/{id}	DELETE	Admin	Delete an event
/events/{id}/upload-image	POST	Admin	Upload event image
/bookings/	POST	Authenticated	Create a booking
/bookings/	GET	Authenticated	View personal bookings
/bookings/all	GET	Admin	View all bookings
/bookings/{id}	DELETE	Authenticated	Cancel a booking
/chatbot/	POST	Public / Authenticated	Chat with AI assistant
```
Booking Flow

The booking system automatically manages event seat availability.

User
  ↓
Select Event
  ↓
Choose Tickets
  ↓
Check Seat Availability
  ↓
Create Booking
  ↓
Update Available Seats
  ↓
Booking Confirmation

When a booking is cancelled, the corresponding seats are returned to the event's available seat count.

AI Chatbot Architecture

The chatbot is connected to the backend rather than directly accessing the database.

User
  ↓
React Chat Interface
  ↓
FastAPI Chatbot Endpoint
  ↓
Groq / Llama 3.3 70B
  ↓
AI Tools
  ↓
Event / Booking Data
  ↓
Response

This allows the assistant to provide answers using current application data instead of relying only on the model's general knowledge.

Admin Analytics

The admin dashboard provides an overview of platform activity, including:

Total bookings
Total revenue
Booking status distribution
Top-performing events
Tickets sold per event

Charts and visualizations are implemented using Recharts.

Current development includes:

 FastAPI backend
 PostgreSQL integration
 JWT authentication
 Role-based authorization
 Event CRUD
 Booking system
 Admin dashboard
 AI chatbot
 React frontend
 Responsive UI
 Docker deployment
 Production deployment

Project Purpose
Evenue was developed as a portfolio project to demonstrate full-stack application development, REST API design, authentication and authorization, database management, AI integration, and modern React development.

📄 License
This project was built for learning and portfolio purposes.
