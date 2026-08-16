import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLink = (to: string, label: string) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors ${
          isActive ? "text-gold" : "text-text-muted hover:text-text"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold text-text tracking-tight">
            Ev<span className="text-gold">en</span>ue
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#home" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
              Home
            </a>
            <a href="/#about" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
              About Us
            </a>
            <a href="/#events" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
              Events
            </a>
            <a href="/#faq" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
              FAQ
            </a>
            {user && user.role !== "admin" && navLink("/my-bookings", "My Bookings")}
            {user?.role === "admin" && (
              <>
                {navLink("/admin/events", "Manage Events")}
                {navLink("/admin/bookings", "All Bookings")}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 pr-3 border-r border-border">
                  <div className="w-7 h-7 rounded-full bg-gold/15 text-gold text-xs font-semibold flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-text-muted">{user.name.split(" ")[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-text-muted hover:text-text transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm bg-gold hover:bg-gold-light text-bg font-semibold px-4 py-1.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(240,165,0,0.3)]"
              >
                Login / Register
              </button>
            )}
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-text"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 space-y-4 bg-bg">
            <div className="flex flex-col gap-3">
              <a href="/#home" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted">
                Home
              </a>
              <a href="/#about" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted">
                About Us
              </a>
              <a href="/#events" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted">
                Events
              </a>
              <a href="/#faq" onClick={() => setMenuOpen(false)} className="text-sm text-text-muted">
                FAQ
              </a>
              {user && navLink("/my-bookings", "My Bookings")}
              {user?.role === "admin" && (
                <>
                  {navLink("/admin/events", "Manage Events")}
                  {navLink("/admin/bookings", "All Bookings")}
                </>
              )}
            </div>
            <div className="pt-3 border-t border-border">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Hi, {user.name.split(" ")[0]}</span>
                  <button onClick={logout} className="text-sm text-gold font-medium">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
                  className="w-full text-sm bg-gold text-bg font-semibold px-5 py-2.5 rounded-full"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}