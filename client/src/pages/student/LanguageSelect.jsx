// src/pages/student/LanguageSelect.jsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import LanguageCard from "./components/LanguageCard";

export default function LanguageSelect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.get("/prompts/languages").then((res) => res.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || isLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#00296b] mb-3">
          Odaberi jezik
        </h1>
        <p className="text-gray-500 text-lg">
          Odaberi jezik za koji želiš vježbati pisanje i govor
        </p>
      </div>

      {languages?.length === 0 && (
        <p className="text-center text-gray-400">
          Nema dostupnih jezika.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {languages?.map((lang) => (
          <LanguageCard key={lang.id} language={lang} />
        ))}
      </div>
    </div>
  );
}