import { useState } from "react";
import api from "../lib/api";  

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/register", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      window.location.href = "/";

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#00296b] mb-6">
          Registracija
        </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Ime"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />
         <input
          type="text"
          name="lastName"
          placeholder="Prezime"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />

        <input
          type="password"
          name="password"
          placeholder="Lozinka"
          required
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className="bg-[#00296b] text-white py-3 rounded-lg font-semibold hover:bg-[#003f88]"
        >
          Registruj se
        </button>
      </form>
    </div>
    </div>
  );
}

export default Register;
