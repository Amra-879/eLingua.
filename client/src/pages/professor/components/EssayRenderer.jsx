import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";

export default function EssayRenderer({ content }) {
  const editor = useEditor({
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class: "prose max-w-none p-4 text-gray-800 leading-relaxed focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || !content) return;
    try {
      editor.commands.setContent(JSON.parse(content));
    } catch {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <EditorContent editor={editor} />
    </div>
  );
}