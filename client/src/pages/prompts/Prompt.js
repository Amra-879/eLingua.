import { useEffect, useState } from "react";

function Prompts() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/prompts")
      .then((res) => res.json())
      .then((data) => setPrompts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-[#00296b] mb-8">
        Writing Prompts
      </h1>

      <div className="flex flex-col gap-6">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-[#00296b]">
                {prompt.title}
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {prompt.level}
              </span>
            </div>

            <p className="text-gray-700 mb-4">
              {prompt.question}
            </p>

            <button
              className="bg-[#00296b] text-white px-4 py-2 rounded-lg hover:bg-[#003f88]"
              onClick={() => (window.location.href = `/prompts/${prompt.id}`)}
            >
              Start Writing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prompts;
