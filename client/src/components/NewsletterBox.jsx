import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const NewsletterBox = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const subscribeMutation = useMutation({
    mutationFn: (emailData) => api.post("/auth/subscribe-newsletter", emailData),
   
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Greška pri prijavi na newsletter";
      setMessage(errorMsg);
      setMessageType("error");
      
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setMessage("Morate biti prijavljeni da biste se pretplatili na newsletter");
      setMessageType("error");
      return;
    }

    if (!email) {
      setMessage("Molimo unesite vašu email adresu");
      setMessageType("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Molimo unesite ispravnu email adresu");
      setMessageType("error");
      return;
    }

    subscribeMutation.mutate({ email });
  };

  return (
    <section className="bg-gray-100 py-12 px-4 text-center mt-16">
      <h2 className="text-2xl font-bold mb-4">
        Potpiši se na naš newsletter
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center gap-2 max-w-xl mx-auto mt-4">
        <input
          type="email"
          placeholder="Vaš email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribeMutation.isPending}
          className="px-4 py-2 rounded-md text-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-200"
        />

        <button
          type="submit"
          disabled={subscribeMutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition w-full md:w-auto disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {subscribeMutation.isPending ? "Prijavljivanje..." : "Subscribe"}
        </button>
      </form>

      {/* Poruka o statusu */}
      {message && (
        <div className={`mt-4 p-3 rounded-md max-w-xl mx-auto ${
          messageType === "success" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

    
      {isAuthenticated && user?.newsletter === 1 && (
        <div className="mt-4 p-3 rounded-md max-w-xl mx-auto bg-green-100 text-green-700 border border-green-200">
         Već ste prijavljeni na naš newsletter. 
        </div>
      )}
    </section>
  );
};

export default NewsletterBox;