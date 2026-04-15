import { useState, useEffect } from "react";

const calculatePrice = (wordCount) => {
  if (wordCount < 1) return 0;
  const base = 4.0;
  const baseWords = 350;
  const extraRate = 0.5;
  const extraInterval = 50;

  if (wordCount <= baseWords) return base;

  const extraWords = wordCount - baseWords;
  const extraChunks = Math.ceil(extraWords / extraInterval);
  return base + extraChunks * extraRate;
};

export default function useWordCount(editor) {
  const [wordCount, setWordCount] = useState(0);
  const [price, setPrice] = useState(4.5);

  useEffect(() => {
    if (!editor) return;

    const updateCount = () => {
      const text = editor.getText().trim();
      const count = text === "" ? 0 : text.split(/\s+/).length;
      setWordCount(count);
      setPrice(calculatePrice(count));
    };

    // pokreni odmah
    updateCount();

    // pokreni svaki put kad se sadržaj promijeni
    editor.on("update", updateCount);
    return () => editor.off("update", updateCount);
  }, [editor]);

  return { wordCount, price };
}