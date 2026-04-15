import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  if (seconds < 60) return `${seconds} s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins} min ${secs} s` : `${mins} min`;
};

function ReadOnlyEditor({ content }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
    editable: false,
  });

  useEffect(() => {
    if (!editor || !content) return;
    try {
      editor.commands.setContent(JSON.parse(content));
    } catch {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 text-gray-800 text-base leading-relaxed prose max-w-none focus:outline-none"
      />
    </div>
  );
}

export default function EssayDetail() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role !== "student") navigate("/");
  }, [user, loading, navigate]);

  if (loading || submissionLoading || feedbackLoading) {
    return <p className="p-8">Učitavanje...</p>;
  }
  if (!user || user.role !== "student") return null;

  const isPending = submission?.status === "pending";
  const isReviewed = submission?.status === "reviewed";
  const isAudio = submission?.type === "audio";
  const isText = submission?.type === "text";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* NAZAD */}
      <Link
        to="/my-essays"
        className="text-sm text-indigo-500 hover:text-indigo-700 transition mb-6 inline-block"
      >
        ← Nazad na moje eseje
      </Link>

      {/* INFO O PROMPTU */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-indigo-400">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#00296b] mb-1">
              {submission?.prompt_title}
            </h1>
            <p className="text-gray-500 text-sm mb-3">
              🕐 Poslano: {formatDate(submission?.created_at)}
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
              {submission?.level}
            </span>

            {/* measurement — riječi ili trajanje ovisno o tipu */}
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
              {isAudio
                ? `🎙️ ${formatDuration(submission?.measurement)}`
                : `📝 ${submission?.measurement} riječi`}
            </span>

            {/* tip eseja */}
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isAudio
                ? "bg-orange-100 text-orange-700"
                : "bg-indigo-100 text-indigo-700"
            }`}>
              {isAudio ? "Audio esej" : "Pisani esej"}
            </span>

            {/* status */}
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isPending
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}>
              {isPending ? "Na čekanju" : "Ocijenjeno"}
            </span>
          </div>
        </div>
      </div>

      {/* SADRŽAJ — tekst ili audio */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {isAudio ? "Tvoj audio esej" : "Tvoj esej"}
        </h2>

        {isAudio ? (
          <div>
            <audio
              src={`http://localhost:5000${submission?.audio_url}`}
              controls
              className="w-full"
            />
          </div>
        ) : (
          <ReadOnlyEditor content={submission?.text_content} />
        )}
      </div>

      {/* FEEDBACK — samo ako je reviewed */}
      {isReviewed && (
        <>
          {/* FEEDBACK TEKST */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#00296b] mb-2">
              Feedback profesora
            </h2>
            {isText && (
              <p className="text-sm text-gray-500 mb-4">
                Profesor je označio greške i napravio ispravke direktno u tvom eseju
              </p>
            )}
            {isAudio ? (
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed">
                {feedback?.feedback_essay
                  ? feedback.feedback_essay
                  : <span className="text-gray-400">Nema feedback teksta</span>}
              </div>
            ) : (
              <ReadOnlyEditor content={feedback?.feedback_essay} />
            )}
          </div>

          {/* OPĆI KOMENTAR + NIVO */}
          {(feedback?.feedback_general || feedback?.assessed_level) && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              {feedback?.assessed_level && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Procijenjeni nivo:
                  </span>
                  <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-bold text-sm">
                    {feedback.assessed_level}
                  </span>
                </div>
              )}
              {feedback?.feedback_general && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Opći komentar:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed">
                    {feedback.feedback_general}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* PENDING PORUKA */}
      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-700 font-medium mb-1">
            {isAudio ? "Audio esej je na čekanju" : "Esej je na čekanju"}
          </p>
          <p className="text-yellow-600 text-sm">
            Profesor još uvijek nije pregledao tvoj {isAudio ? "audio esej" : "esej"}. Pogledaj ponovo uskoro.
          </p>
        </div>
      )}

    </div>
  );
}