export default function PromptList({ prompts, onEdit, onDelete, isDeleting, editingId }) {
  if (prompts?.length === 0) {
    return <p className="text-gray-500">Nema kreiranih promptova.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {prompts?.map((prompt) => (
        <div
          key={prompt.id}
          className={`bg-white rounded-2xl shadow-md p-6 border-l-4 transition ${
            editingId === prompt.id ? "border-[#003f88]" : "border-transparent"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {prompt.title}
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{prompt.question}</p>
              <div className="flex gap-3 mt-3">
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {prompt.language_name}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {prompt.level}
                </span>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(prompt)}
                className="text-sm border border-[#00296b] text-[#00296b] px-4 py-1.5 rounded-lg hover:bg-[#00296b] hover:text-white transition"
              >
                Uredi
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                disabled={isDeleting}
                className="text-sm border border-red-400 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition disabled:opacity-50"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}