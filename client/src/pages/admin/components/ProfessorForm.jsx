export default function ProfessorForm({
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
        {isEditing ? "Uredi profesora" : "Dodaj novog profesora"}
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

        {/* Polja samo za kreiranje */}
        {!isEditing && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ime <span className="text-red-400">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  placeholder="Ime"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prezime <span className="text-red-400">*</span>
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  required
                  placeholder="Prezime"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="email@primjer.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Lozinka <span className="text-red-400">*</span>
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                placeholder="Minimalno 8 znakova"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88]"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Jezik <span className="text-red-400">*</span>
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
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={3}
            placeholder="Kratki opis profesora (opcionalno)..."
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003f88] resize-none"
          />
        </div>

        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-[#00296b] text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-[#003f88] transition disabled:opacity-50"
          >
            {isPending
              ? "Čuvanje..."
              : isEditing
              ? "Sačuvaj"
              : "Dodaj profesora"}
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