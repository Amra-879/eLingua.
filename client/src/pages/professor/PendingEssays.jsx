import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import SubmissionCard from "./components/SubmissionCard";

export default function LoadPendingEssays() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["pending-submissions"],
    queryFn: () => api.get("/submissions/pending").then((res) => res.data),
    enabled: !!user && user.role === "professor",
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "professor")) navigate("/");
  }, [user, loading, navigate]);

  if (loading || isLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "professor") return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00296b]">Na čekanju</h1>
        <p className="text-gray-500 mt-1">
          Eseji koji čekaju na ocjenjivanje
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
        <span className="text-yellow-600 font-bold text-xl">
          {submissions?.length ?? 0}
        </span>
        <span className="text-yellow-700 text-sm">
          {submissions?.length === 1 ? "esej čeka" : "eseja čeka"} na ocjenjivanje
        </span>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nema eseja na čekanju 🎉</p>
        </div>
        ) : (
        <div className="flex flex-col gap-4">
            {submissions.map((submission) => (
            <SubmissionCard
                key={submission.id}
                submission={submission}
                type="pending"
            />
            ))}
        </div>
        )}
    </div>
  );
}