const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function PromptForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  languages,
  isEditing,
  isPending,
  error,
  success,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-base font-semibold text-[#00296b] mb-3">
        {isEditing ? "Uredi prompt" : "Dodaj novi prompt"}
      </h2>

      {error && (
        <p className="text-red-500 text-xs mb-3 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-xs mb-3 bg-green-50 p-2 rounded-lg">
          {success}
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Naslov
          </label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
            placeholder="Unesite naslov"
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Pitanje / Prompt
          </label>
          <textarea
            name="question"
            value={form.question}
            onChange={onChange}
            required
            rows={4}
            placeholder="Unesite tekst prompta..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Jezik
          </label>
          <select
            name="language"
            value={form.language}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
          >
            <option value="">Odaberi jezik</option>
            {languages?.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nivo
          </label>
          <select
            name="level"
            value={form.level}
            onChange={onChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
          >
            <option value="">Odaberi nivo</option>
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-[#00296b] text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-[#003f88] transition disabled:opacity-50"
          >
            {isPending ? "Čuvanje..." : isEditing ? "Sačuvaj" : "Kreiraj"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Odustani
            </button>
          )}
        </div>
      </form>
    </div>
  );
}