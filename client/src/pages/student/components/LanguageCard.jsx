import { useNavigate } from "react-router-dom";

export default function LanguageCard({ language }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/prompts/${language.id}`)}
      className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 border-2 border-transparent hover:border-indigo-400"
    >
      <span className="text-5xl font-bold text-indigo-600 uppercase">
        {language.code}
      </span>
      <span className="text-lg font-semibold text-gray-700">
        {language.name}
      </span>
    </div>
  );
}