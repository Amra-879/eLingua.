import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("bs-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SubmissionCard({ submission, type = "pending" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {submission.prompt_title}
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            👤 {submission.student_name} {submission.student_last_name}
          </p>

          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {submission.language_name}
            </span>
            {submission.assessed_level && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                Nivo: {submission.assessed_level}
              </span>
            )}
          </div>

          <div className="flex gap-4 text-sm text-gray-400 flex-wrap">
            <span>📝 {submission.measurement} riječi</span>
            <span>🕐 {formatDate(submission.created_at)}</span>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0">
          {type === "pending" ? (
            <Link
              to={`/professor/review/${submission.id}`}
              className="bg-[#00296b] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003f88] transition"
            >
              Ocijeni →
            </Link>
          ) : (
            <Link
              to={`/professor/review/${submission.submission_id}`}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Pogledaj →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}