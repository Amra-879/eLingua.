import { Link } from "react-router-dom";

const LanguageOptions = () => {
  return (
    <section className="flex justify-center mt-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">

        <Link to="/prompts/2" className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Njemački 🇩🇪
        </Link>
        <Link to="/prompts/1" className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Engleski en
        </Link>
         <Link to="/prompts/4" className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Španjolski 🇪🇸
        </Link>
        <Link to="/prompts/7" className="px-8 py-4 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-lg">
          Japanski 🇯🇵
        </Link>
        <Link to="prompts" className="px-8 py-4 bg-gray-300 text-gray-700 rounded-xl shadow cursor-not-allowed text-lg">
          Ostali 📚
        </Link>

      </div>
    </section>
  );
};

export default LanguageOptions;
