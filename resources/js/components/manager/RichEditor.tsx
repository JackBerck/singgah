import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading2,
    Heading3,
    Undo,
    Redo,
} from 'lucide-react';

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    error?: string;
}

function ToolbarBtn({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`flex h-7 w-7 items-center justify-center rounded-md text-sm transition-colors ${
                active
                    ? 'bg-[var(--singgah-green-600)] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichEditor({
    content,
    onChange,
    placeholder = 'Tulis deskripsi...',
    error,
}: RichEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none min-h-[200px] focus:outline-none px-4 py-3',
            },
        },
    });

    if (!editor) return null;

    return (
        <div
            className={`overflow-hidden rounded-xl border transition-colors ${error ? 'border-red-400' : 'border-gray-200 focus-within:border-[var(--singgah-green-500)]'}`}
        >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-3 py-2">
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <div className="mx-1 h-5 w-px bg-gray-200" />
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    active={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    active={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <div className="mx-1 h-5 w-px bg-gray-200" />
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    active={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    active={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <div className="mx-1 h-5 w-px bg-gray-200" />
                <ToolbarBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >
                    <Undo className="h-3.5 w-3.5" />
                </ToolbarBtn>
                <ToolbarBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >
                    <Redo className="h-3.5 w-3.5" />
                </ToolbarBtn>
            </div>
            {/* Editor Content */}
            <div className="bg-white">
                <EditorContent editor={editor} placeholder={placeholder} />
            </div>
        </div>
    );
}
