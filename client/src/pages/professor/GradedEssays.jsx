// src/pages/professor/Graded.jsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import SubmissionCard from "./components/SubmissionCard";

export default function LoadGradedEssays() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["my-feedbacks"],
    queryFn: () => api.get("/feedback/my").then((res) => res.data),
    enabled: !!user && user.role === "professor",
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "professor")) navigate("/");
  }, [user, loading, navigate]);

  if (loading || isLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "professor") return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00296b]">Ocijenjene vježbe</h1>
        <p className="text-gray-500 mt-1">Eseji koje si već ocijenio/la</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl mb-6 text-sm">
          {successMessage}
        </div>
      )}

      {feedbacks?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            Još nisi ocijenio/la nijedan esej
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {feedbacks?.map((feedback) => (
            <SubmissionCard
              key={feedback.id}
              submission={feedback}
              type="reviewed"
            />
          ))}
        </div>
      )}
    </div>
  );
}