import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  pending: {
    label: "Na čekanju",
    className: "bg-yellow-100 text-yellow-700",
  },
  reviewed: {
    label: "Ocijenjeno",
    className: "bg-green-100 text-green-700",
  },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")} min`;
};

export default function EssayCard({ essay }) {
  const status = STATUS_CONFIG[essay.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-300">
      <div className="flex justify-between items-start">

        {/* LIJEVO — info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {essay.prompt_title}
          </h3>

          <div className="flex gap-2 mb-3">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {essay.language_name}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              {essay.level}
            </span>
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <span>
                {essay.type === "audio" ? (
                    <>🎤 {formatDuration(essay.measurement)}</>
                ) : (
                    <>📝 {essay.measurement} riječi</>
                )}
            </span>
            <span>🕐 {formatDate(essay.created_at)}</span>
          </div>
        </div>

        {/* DESNO — status + link */}
        <div className="flex flex-col items-end gap-3 ml-4">
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${status.className}`}>
            {status.label}
        </span>

        <Link
            to={`/my-essays/${essay.id}`}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
            {essay.status === "reviewed" ? "Pogledaj feedback →" : "Pogledaj esej →"}
        </Link>
        </div>

      </div>
    </div>
  );
}