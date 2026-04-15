import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);
      const { token, role, name } = res.data;

      // AuthContext 
      login(token, { role, name });

      // redirect po roli
      if (role === "admin") {
        navigate("/admin/prompts");
      } else if (role === "professor") {
        navigate("/professor/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#00296b] mb-6">
          Prijava na sistem
        </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003f88]"
        />

        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003f88]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#00296b] text-white py-3 rounded-lg font-semibold hover:bg-[#003f88] transition disabled:opacity-50"
        >
          {loading ? "Prijava..." : "Prijavi se"}
        </button>
      </form>
    </div>
  </div>
  );
}

export default Login;