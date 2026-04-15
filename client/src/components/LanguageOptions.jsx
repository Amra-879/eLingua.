const LanguageOptions = () => {
  return (
    <section className="flex justify-center mt-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">

        <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Njemački 🇩🇪
        </button>

        <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Engleski en
        </button>
         <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Španjolski 🇪🇸
        </button>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Japanski 🇯🇵
        </button>

        <button className="px-8 py-4 bg-gray-300 text-gray-700 rounded-xl shadow cursor-not-allowed text-lg">
          Ostali 📚
        </button>

      </div>
    </section>
  );
};

export default LanguageOptions;
