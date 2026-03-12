import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:6525";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reporter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      alert("Registration successful. Please log in.");
      navigate("/", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Left gradient panel */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/2 bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 text-white flex-col justify-between px-8 py-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center text-xl font-bold">
              T
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">
                Tracker
              </p>
              <p className="text-lg font-semibold">Issue Portal</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-3">
            Create your account.
          </h2>
          <p className="text-sm text-white/80 max-w-sm">
            Choose your role and start reporting issues, managing projects, or administering the tracker.
          </p>
        </div>
        <p className="text-[11px] text-white/60">
          You can change your role later from the administrator panel if needed.
        </p>
      </div>

      {/* Right auth card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1 text-center sm:text-left">
            Sign up
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-4 text-center sm:text-left">
            Create an account with email and password, or continue with Google.
          </p>

          {error && (
            <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-3 mb-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Role
              </label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="reporter">Reporter</option>
                <option value="developer">Developer</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? "Creating account..." : "Sign up with email"}
            </button>
          </form>

          <div className="flex items-center my-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-2 text-[11px] text-slate-400 uppercase tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <a
            href={`${API_BASE}/api/auth/google`}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition mb-3"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign up with Google</span>
          </a>

          <p className="text-xs sm:text-sm text-slate-600 text-center mt-1">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
