import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../lib/api";
import EssayCard from "./components/EssayCard";


// helper funkcije za računanje nivoa tečnosti
const LEVEL_VALUES = {
  "A1": 1, "A1/A2": 1.5, "A2": 2,
  "B1": 3, "B1/B2": 3.5, "B2": 4,
  "C1": 5, "C1/C2": 5.5, "C2": 6,
};

const VALUE_TO_LEVEL = {
  1: "A1", 1.5: "A1/A2", 2: "A2",
  3: "B1", 3.5: "B1/B2", 4: "B2",
  5: "C1", 5.5: "C1/C2", 6: "C2",
};

const LEVEL_COLORS = {
  "A1": "bg-red-100 text-red-700",
  "A1/A2": "bg-orange-100 text-orange-700",
  "A2": "bg-orange-100 text-orange-700",
  "B1": "bg-yellow-100 text-yellow-700",
  "B1/B2": "bg-yellow-100 text-yellow-700",
  "B2": "bg-blue-100 text-blue-700",
  "C1": "bg-indigo-100 text-indigo-700",
  "C1/C2": "bg-purple-100 text-purple-700",
  "C2": "bg-green-100 text-green-700",
};

const calculateAverageLevel = (essays) => {
  const values = essays
    .filter((e) => e.assessed_level)
    .map((e) => LEVEL_VALUES[e.assessed_level])
    .filter(Boolean);

  if (values.length === 0) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const allValues = Object.keys(VALUE_TO_LEVEL).map(Number);
  const closest = allValues.reduce((prev, curr) =>
    Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev
  );

  return VALUE_TO_LEVEL[closest];
};

export default function MyEssays() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  // success poruka koja dolazi nakon submissiona
  const successMessage = location.state?.successMessage;

  const { data: essays, isLoading } = useQuery({
    queryKey: ["my-essays"],
    queryFn: () => api.get("/submissions/my").then((res) => res.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role !== "student") navigate("/");
  }, [user, loading, navigate]);

  if (loading || isLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "student") return null;

  // grupiši eseje po jeziku
  const groupedByLanguage = essays?.reduce((acc, essay) => {
    const key = essay.language_name;
    if (!acc[key]) {
      acc[key] = {
        language_name: key,
        language_id: essay.language_id,
        essays: [],
      };
    }
    acc[key].essays.push(essay);
    return acc;
  }, {}) ?? {};

  const languageGroups = Object.values(groupedByLanguage);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00296b]">Moji eseji</h1>
        <p className="text-gray-500 mt-1">
          Pregled svih tvojih poslanih eseja
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl mb-6 text-sm">
          {successMessage}
        </div>
      )}

      {essays?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">
            Još nisi poslao/la nijedan esej
          </p>
          <Link
            to="/prompts"
            className="bg-[#00296b] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#003f88] transition"
          >
            Počni vježbati
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {languageGroups.map((group) => {
            const averageLevel = calculateAverageLevel(group.essays);
            const pending = group.essays.filter((e) => e.status === "pending").length;
            const reviewed = group.essays.filter((e) => e.status === "reviewed").length;
            const assessedCount = group.essays.filter((e) => e.assessed_level).length;

            return (
              <div key={group.language_name}>

                {/* NASLOV JEZIKA */}
                <h2 className="text-2xl font-bold text-[#00296b] mb-4">
                  {group.language_name}
                </h2>

                {/* GRID STATISTIKE */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="border rounded-xl px-5 py-4 bg-indigo-50 text-indigo-700 border-indigo-200">
                    <p className="text-2xl font-bold">{group.essays.length}</p>
                    <p className="text-sm mt-1 opacity-80">Ukupno eseja</p>
                  </div>
                  <div className="border rounded-xl px-5 py-4 bg-yellow-50 text-yellow-700 border-yellow-200">
                    <p className="text-2xl font-bold">{pending}</p>
                    <p className="text-sm mt-1 opacity-80">Na čekanju</p>
                  </div>
                  <div className="border rounded-xl px-5 py-4 bg-green-50 text-green-700 border-green-200">
                    <p className="text-2xl font-bold">{reviewed}</p>
                    <p className="text-sm mt-1 opacity-80">Ocijenjeno</p>
                  </div>
                  <div className="border rounded-xl px-5 py-4 bg-purple-50 text-purple-700 border-purple-200">
                    <p className="text-sm opacity-80 mb-1">Procijenjeni nivo tečnosti</p>
                    {averageLevel ? (
                      <>
                        <span className={`inline-block text-xl font-bold px-3 py-0.5 rounded-full ${
                          LEVEL_COLORS[averageLevel] ?? "bg-gray-100 text-gray-700"
                        }`}>
                          {averageLevel}
                        </span>
                        <p className="text-xs opacity-60 mt-1">
                          na osnovu {assessedCount} ocjena
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold opacity-50">—</p>
                    )}
                  </div>
                </div>

                {/* LISTA ESEJA */}
                <div className="flex flex-col gap-4">
                  {group.essays.map((essay) => (
                    <EssayCard key={essay.id} essay={essay} />
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}