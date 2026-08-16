import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      await login(data.access_token);
      onClose();
    },
    onError: () => setError("Invalid email or password"),
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setMode("login");
      setError("");
      setPassword("");
    },
    onError: (err: any) => {
      setError(err?.response?.data?.detail || "Registration failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-text">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-text-muted text-sm mt-1">
              {mode === "login" ? "Log in to book your next event" : "Join to start booking events"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-sm text-text-muted mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-gold transition-colors"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-gold transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {mode === "register" && registerMutation.isSuccess && (
            <p className="text-green-400 text-sm">Account created! Please log in.</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-2 text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Please wait..." : mode === "login" ? "Log In" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-gold hover:text-gold-light font-medium"
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}