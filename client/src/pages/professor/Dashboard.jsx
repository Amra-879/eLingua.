import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../lib/api";

export default function ProfessorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: pending } = useQuery({
    queryKey: ["pending-submissions"],
    queryFn: () => api.get("/submissions/pending").then((res) => res.data),
    enabled: !!user && user.role === "professor",
    refetchInterval: 30000,
  });

  const { data: graded } = useQuery({
    queryKey: ["my-feedbacks"],
    queryFn: () => api.get("/feedback/my").then((res) => res.data),
    enabled: !!user && user.role === "professor",
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["professor-revenue", user?.id],
    queryFn: () => api.get("/payments/professor/revenue").then((res) => res.data),
    enabled: !!user && user.role === "professor",
  });


  useEffect(() => {
    if (!loading && (!user || user.role !== "professor")) navigate("/");
  }, [user, loading, navigate]);

  if (loading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "professor") return null;

  const pendingCount = pending?.length ?? 0;
  const gradedCount = graded?.length ?? 0;
  const recentPending = pending?.slice(0, 3) ?? [];
  const currentMonthRevenue = revenueData?.current_month?.revenue_this_month ?? 0;


  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00296b]">
          Dobrodošli, {user.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Pregled tvojih aktivnosti
        </p>
      </div>

      {/* STAT KARTICE */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-4xl font-bold text-yellow-600 mb-1">
            {pendingCount}
          </p>
          <p className="text-yellow-700 font-medium">Na čekanju</p>
          <p className="text-yellow-600 text-sm mt-1">
            {pendingCount === 0
              ? "Sve je ocijenjeno 🎉"
              : "Eseji čekaju na ocjenjivanje"}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-4xl font-bold text-green-600 mb-1">
            {gradedCount}
          </p>
          <p className="text-green-700 font-medium">Ocijenjeno</p>
          <p className="text-green-600 text-sm mt-1">
            Ukupno ocijenjenih eseja
          </p>
        </div>
      </div>

      {/* BRZE AKCIJE */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          to="/professor/pending"
          className="flex items-center gap-3 bg-[#00296b] hover:bg-[#003f88] text-white px-5 py-4 rounded-xl transition font-medium"
        >
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold">Na čekanju</p>
            <p className="text-sm opacity-80">Pregledaj eseje</p>
          </div>
        </Link>
        <Link
          to="/professor/graded"
          className="flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-4 rounded-xl transition font-medium"
        >
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold">Ocijenjene vježbe</p>
            <p className="text-sm text-gray-500">Pregledaj historiju</p>
          </div>
        </Link>
      </div>

      {/* NEDAVNI PENDING ESEJI */}
      {recentPending.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#00296b]">
              Čeka na ocjenjivanje
            </h2>
            <Link
              to="/professor/pending"
              className="text-sm text-indigo-500 hover:text-indigo-700"
            >
              Vidi sve →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentPending.map((submission) => (
              <Link
                key={submission.id}
                to={`/professor/review/${submission.id}`}
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl transition"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {submission.prompt_title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    👤 {submission.student_name} {submission.student_last_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {submission.language_name}
                  </span>
                  <span className="text-indigo-500 text-sm">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* NEMA PENDING */}
      {pendingCount === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <p className="text-green-600 text-sm mt-1">
            Nema eseja na čekanju trenutno.
          </p>
        </div>
      )}
    
     <div className="mt-8">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white w-full">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Zarada za tekući mjesec</p>
            <p className="text-3xl font-bold mt-2">
              {revenueLoading ? "..." : `$${7.5}`}
            </p>
          </div>
          <div className="text-3xl bg-white/20 rounded-full p-3">
            💰
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 text-xs text-emerald-100">
          Platforma zadržava $0.50 po eseju
        </div>
      </div>
      </div>
 


    </div>
    
  );
}