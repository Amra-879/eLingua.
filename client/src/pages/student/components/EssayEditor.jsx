import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Pilcrow,
  Highlighter,
  Palette,
  RotateCcw,
  RotateCw,
} from "lucide-react";

export default function EssayEditor({ editor }) {
  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">

      {/* TOOLBAR */}
      <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap items-center">

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Poništi"
        >
          <RotateCcw size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Ponovi"
        >
          <RotateCw size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Podvučeno"
        >
          <UnderlineIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Prekriženo"
        >
          <Strikethrough size={15} />
        </ToolbarButton>

        <Divider />

        <div className="flex items-center gap-1">
          <Palette size={15} className="text-gray-500" />
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            title="Boja teksta"
          />
        </div>

        <div className="flex items-center gap-1">
          <Highlighter size={15} className="text-gray-500" />
          <input
            type="color"
            onChange={(e) =>
              editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
            }
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            title="Pozadinska boja"
          />
        </div>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Naslov 1"
        >
          <span className="text-xs font-bold">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Naslov 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Naslov 3"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraf"
        >
          <Pilcrow size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Neuređena lista"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numerisana lista"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

      </div>

      {/* EDITOR SADRŽAJ */}
      <EditorContent
        editor={editor}
        className="min-h-[350px] p-4 text-gray-800 text-base leading-relaxed"
      />
    </div>
  );
}

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-200"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-300 mx-1" />;
}