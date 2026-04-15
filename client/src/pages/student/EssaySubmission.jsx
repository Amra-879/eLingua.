import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, BackgroundColor, FontFamily, FontSize, LineHeight, TextStyleKit } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import useWordCount from "../../hooks/useWordCount";
import EssayEditor from "./components/EssayEditor";
import WordCountBar from "./components/WordCountBar";
import PayPalButton from "./components/PaypalButton";

export default function EssaySubmission() {
  const { promptId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BackgroundColor,
      Color,
      FontFamily,
      FontSize,
      LineHeight,
      TextStyle,
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
    ],
    content: "",
  });

  const { wordCount, price } = useWordCount(editor);

  const { data: prompt, isLoading: promptLoading } = useQuery({
    queryKey: ["prompt", promptId],
    queryFn: () => api.get(`/prompts/${promptId}`).then((res) => res.data),
    enabled: !!user && !!promptId,
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role !== "student") navigate("/");
  }, [user, loading, navigate]);

  // sakrij PayPal ako korisnik nastavlja pisati
  useEffect(() => {
    if (showPayPal) setShowPayPal(false);
  }, [wordCount]);

  if (loading || promptLoading) return <p className="p-8">Učitavanje...</p>;
  if (!user || user.role !== "student") return null;

  // ovu funkciju proslijeđujemo PayPalButton-u da dohvati sadržaj editora
  const getEditorContent = () => ({
    text_content: JSON.stringify(editor.getJSON()),
    prompt_id: parseInt(promptId),
  });

  const handlePayClick = () => {
    setError("");

    if (wordCount < 1) {
      setError("Esej ne može biti prazan");
      return;
    }

    setShowPayPal(true);
  };

  const handlePaymentSuccess = (result) => {
    navigate("/my-essays", {
      state: {
        successMessage: `Esej uspješno poslan! Plaćeno: $${result.amount}`,
      },
    });
  };

  const handlePaymentError = (message) => {
    setError(message);
    setShowPayPal(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* NAZAD */}
      <Link
        to={`/prompts/${prompt?.language_id}`}
        className="text-sm text-indigo-500 hover:text-indigo-700 transition mb-6 inline-block"
      >
        ← Nazad na promptove
      </Link>

      {/* INFO O PROMPTU */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-l-4 border-indigo-400">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-[#00296b]">
            {prompt?.title}
          </h1>
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {prompt?.language_name}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              {prompt?.level}
            </span>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed">{prompt?.question}</p>
      </div>
      
      {/* WORD COUNT + CIJENA */}
      <div className="mb-4">
        <WordCountBar wordCount={wordCount} price={price} />
      </div>

      {/* EDITOR */}
      <div className="mb-6">
        <EssayEditor editor={editor} />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      {/* SUBMIT SEKCIJA */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Minimalno preporučeno: 350 riječi</p>
            <p className="text-sm text-gray-500 mt-1">
              Cijena: <span className="font-semibold text-green-600">${price.toFixed(2)}</span>
            </p>
          </div>

          {/* PLATI dugme — prikazuje PayPal */}
          {!showPayPal && (
            <button
            onClick={handlePayClick}
            disabled={wordCount < 1}
            className="flex items-center gap-2 bg-[#00296b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#003f88] transition disabled:opacity-50"
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.817l-1.15 7.29h3.168c.458 0 .85-.334.922-.787l.038-.199.735-4.653.047-.258a.932.932 0 0 1 .922-.786h.58c3.76 0 6.705-1.528 7.563-5.948.362-1.852.174-3.4-.42-4.454z"/>
            </svg>
            Plati i pošalji 
            </button>
          )}
        </div>

        {/* PAYPAL DUGME — pojavljuje se nakon klika */}
        {showPayPal && (
          <div>
            <p className="text-sm text-gray-500 mb-3 text-center">
              Klikni PayPal dugme da završiš plaćanje
            </p>
            <PayPalButton
              wordCount={wordCount}
              getEditorContent={getEditorContent}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            <button
              onClick={() => setShowPayPal(false)}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Odustani
            </button>
          </div>
        )}
      </div>

    </div>
  );
}