import { useNavigate } from "react-router-dom";

export default function PromptCard({ prompt }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-400">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {prompt.title}
        </h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium flex-shrink-0 ml-3">
          {prompt.level}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-5 leading-relaxed">
        {prompt.question}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/essay/${prompt.id}`)}
          className="flex-1 bg-[#00296b] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#003f88] transition"
        >
          ✍️ Napiši esej
        </button>
        <button
          onClick={() => navigate(`/audio/${prompt.id}`)}
          className="flex-1 border border-[#00296b] text-[#00296b] py-2 rounded-lg text-sm font-semibold hover:bg-[#00296b] hover:text-white transition"
        >
          🎙️ Snimi audio esej
        </button>
      </div>
    </div>
  );
}