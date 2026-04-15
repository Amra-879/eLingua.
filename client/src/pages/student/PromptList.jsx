import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../lib/api";
import PromptCard from "./components/PromptCard";

export default function PromptList() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { languageId } = useParams();

  const { data: prompts, isLoading: promptsLoading } = useQuery({
    queryKey: ["prompts", languageId],
    queryFn: () =>
      api.get(`/prompts/language/${languageId}`).then((res) => res.data),
    enabled: !!user && !!languageId,
  });

  // dohvati naziv jezika za heading
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.get("/prompts/languages").then((res) => res.data),
    enabled: !!user,
  });

  const currentLanguage = languages?.find(
    (l) => l.id === parseInt(languageId)
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading || promptsLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* BACK + HEADING */}
      <div className="mb-8">
        <Link
          to="/prompts"
          className="text-sm text-indigo-500 hover:text-indigo-700 transition mb-3 inline-block"
        >
          ← Nazad na odabir jezika
        </Link>
        <h1 className="text-3xl font-bold text-[#00296b]">
          {currentLanguage?.name ?? "Promptovi"}
        </h1>
        <p className="text-gray-500 mt-1">
          Odaberi prompt i počni vježbati
        </p>
      </div>

      {/* FILTER PO NIVOU */}
      {prompts?.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => {
            const hasLevel = prompts.some((p) => p.level === level);
            if (!hasLevel) return null;
            return (
              <span
                key={level}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium"
              >
                {level}
              </span>
            );
          })}
        </div>
      )}

      {/* LISTA */}
      {prompts?.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          Nema dostupnih promptova za ovaj jezik.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {prompts?.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>

    </div>
  );
}