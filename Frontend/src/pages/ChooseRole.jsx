import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://tracker-backend-o90y.onrender.com";

export default function ChooseRole() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [role, setRole] = useState("reporter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) navigate("/");
    const existingRole = localStorage.getItem("role");
    if (existingRole && existingRole !== "pending") {
      if (existingRole === "administrator") navigate("/admin");
      else if (existingRole === "developer") navigate("/developer");
      else navigate("/reporter");
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/api/auth/role`,
        { role },
        { headers: { Authorization: token } }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "administrator") navigate("/admin");
      else if (res.data.user.role === "developer") navigate("/developer");
      else navigate("/reporter");
    } catch (err) {
      setError(err.data.msg || "Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Choose your role</h2>
        <p className="text-sm text-gray-600 text-center">
          This helps us send you to the right dashboard.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="reporter">Reporter</option>
            <option value="developer">Developer</option>
            <option value="administrator">Administrator</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

