// src/pages/professor/ReviewSubmission.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import EssayEditor from "../student/components/EssayEditor";

const LEVELS = ["A1", "A1/A2", "A2", "B1", "B1/B2", "B2", "C1", "C1/C2", "C2"];

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds} s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins} min ${secs} s` : `${mins} min`;
};

export default function ReviewSubmission() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [feedbackGeneral, setFeedbackGeneral] = useState("");
  const [assessedLevel, setAssessedLevel] = useState("");
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
  });

  const { data: submission, isLoading: submissionLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => api.get(`/submissions/${id}`).then((res) => res.data),
    enabled: !!user && !!id,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["feedback", id],
    queryFn: () => api.get(`/feedback/submission/${id}`).then((res) => res.data),
    enabled: !!submission && submission.status === "reviewed",
    retry: false,
  });

  const feedbackMutation = useMutation({
    mutationFn: (data) => api.post("/feedback", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-submissions"]);
      queryClient.invalidateQueries(["my-feedbacks"]);
      navigate("/professor/pending", {
        state: { successMessage: "Feedback uspješno poslan!" },
      });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Greška pri slanju feedbacka");
    },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "professor")) navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!editor || !submission) return;

    const isAudio = submission.type === "audio";
    const isReviewed = submission.status === "reviewed";

    // audio esej — editor nije potreban
    if (isAudio) return;

    if (isReviewed && feedback?.feedback_essay) {
      try {
        editor.commands.setContent(JSON.parse(feedback.feedback_essay));
      } catch {
        editor.commands.setContent(feedback.feedback_essay);
      }
      if (feedback.feedback_general) setFeedbackGeneral(feedback.feedback_general);
      if (feedback.assessed_level) setAssessedLevel(feedback.assessed_level);
      editor.setEditable(false);
      return;
    }

    if (submission.status === "pending" && submission.text_content) {
      try {
        editor.commands.setContent(JSON.parse(submission.text_content));
      } catch {
        editor.commands.setContent(submission.text_content);
      }
    }
  }, [submission, feedback, editor]);

  // popuni feedback za reviewed audio esej
  useEffect(() => {
    if (!feedback || submission?.type !== "audio") return;
    if (feedback.feedback_general) setFeedbackGeneral(feedback.feedback_general);
    if (feedback.assessed_level) setAssessedLevel(feedback.assessed_level);
  }, [feedback, submission]);

  if (loading || submissionLoading || feedbackLoading) {
    return <p className="p-8">Učitavanje...</p>;
  }
  if (!user || user.role !== "professor") return null;

  const isReviewed = submission?.status === "reviewed";
  const isAudio = submission?.type === "audio";
  const isText = submission?.type === "text";

  const handleSubmit = () => {
    setError("");

    // za audio — samo opći komentar je obavezan (feedback_essay može biti null)
    // za text — editor mora imati sadržaj
    if (isText) {
      const feedbackText = editor?.getText().trim();
      if (!feedbackText) {
        setError("Feedback ne može biti prazan");
        return;
      }
    }

    feedbackMutation.mutate({
      submission_id: parseInt(id),
      feedback_essay: isText ? JSON.stringify(editor.getJSON()) : null,
      feedback_general: feedbackGeneral || null,
      assessed_level: assessedLevel || null,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* NAZAD */}
      <Link
        to="/professor/pending"
        className="text-sm text-indigo-500 hover:text-indigo-700 transition mb-6 inline-block"
      >
        ← Nazad na listu
      </Link>

      {/* INFO O PROMPTU I STUDENTU */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-indigo-400">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#00296b] mb-1">
              {submission?.prompt_title}
            </h1>
            <p className="text-gray-500 text-sm mb-3">
              👤 {submission?.student_name} {submission?.student_last_name}
            </p>
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-xs font-medium text-indigo-700 mb-1">Prompt:</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {submission?.question}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 ml-6 flex-wrap justify-end">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {submission?.language_name}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              Nivo: {submission?.level}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
              {isAudio
                ? `🎙️ ${formatDuration(submission?.measurement)}`
                : `📝 ${submission?.measurement} riječi`}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isAudio
                ? "bg-orange-100 text-orange-700"
                : "bg-indigo-100 text-indigo-700"
            }`}>
              {isAudio ? "Audio esej" : "Pisani esej"}
            </span>
          </div>
        </div>
      </div>

      {/* AUDIO PLAYER — samo za audio eseje */}
      {isAudio && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#00296b] mb-4">
            Audio esej studenta
          </h2>
          <audio
            src={`http://localhost:5000${submission?.audio_url}`}
            controls
            className="w-full"
          />
        </div>
      )}

      {/* TEKST EDITOR — samo za pisane eseje */}
      {isText && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#00296b]">
              {isReviewed ? "Ocijenjeni esej" : "Uredi i označi esej"}
            </h2>
            {!isReviewed && (
              <div className="flex gap-2 text-xs text-gray-400">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  💡 Koristi highlight za označavanje grešaka
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  💡 Koristi crvenu boju za ispravke
                </span>
              </div>
            )}
          </div>
          <EssayEditor editor={editor} />
        </div>
      )}

      {/* FEEDBACK FORMA */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-[#00296b] mb-6">
          {isReviewed ? "Poslani komentar" : "Komentar i ocjena"}
        </h2>

        {/* OPĆI KOMENTAR */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opći komentar
            {isAudio && !isReviewed && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
          <textarea
            value={feedbackGeneral}
            onChange={(e) => setFeedbackGeneral(e.target.value)}
            disabled={isReviewed}
            rows={4}
            placeholder={
              isAudio
                ? "Napiši komentar o audio eseju..."
                : "Napiši opći komentar o eseju (opcionalno)..."
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88] resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* PROCIJENJENI NIVO */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Procjena nivoa studenta
          </label>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                disabled={isReviewed}
                onClick={() =>
                  setAssessedLevel(assessedLevel === level ? "" : level)
                }
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  assessedLevel === level
                    ? "bg-[#00296b] text-white border-[#00296b]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#00296b] hover:text-[#00296b]"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        {!isReviewed ? (
          <button
            onClick={handleSubmit}
            disabled={feedbackMutation.isPending}
            className="w-full bg-[#00296b] text-white py-3 rounded-xl font-semibold hover:bg-[#003f88] transition disabled:opacity-50"
          >
            {feedbackMutation.isPending ? "Slanje..." : "Pošalji feedback"}
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl text-sm text-center">
             Feedback za ovaj esej je poslan.
          </div>
        )} 
      </div>

    </div>
  );
}