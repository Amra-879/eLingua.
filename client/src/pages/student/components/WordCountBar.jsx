export default function WordCountBar({ wordCount, price }) {
  const baseWords = 350;
  const isOverBase = wordCount > baseWords;

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Broj riječi:</span>
        <span>  {wordCount}  </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Cijena:</span>
        <span className="text-lg font-bold text-green-600">
          ${price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}