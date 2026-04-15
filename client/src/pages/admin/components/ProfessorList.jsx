// src/pages/admin/components/ProfessorList.jsx
export default function ProfessorList({
  professors,
  onEdit,
  onDelete,
  isDeleting,
  editingId,
}) {
  if (professors?.length === 0) {
    return <p className="text-gray-500">Nema dodanih profesora.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {professors?.map((professor) => (
        <div
          key={professor.id}
          className={`bg-white rounded-2xl shadow-md p-6 border-l-4 transition ${
            editingId === professor.id
              ? "border-[#003f88]"
              : "border-transparent"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {professor.name} {professor.last_name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {professor.language_name}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">{professor.email}</p>

              {professor.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {professor.bio}
                </p>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(professor)}
                className="text-sm border border-[#00296b] text-[#00296b] px-4 py-1.5 rounded-lg hover:bg-[#00296b] hover:text-white transition"
              >
                Uredi
              </button>
              <button
                onClick={() => onDelete(professor.id)}
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