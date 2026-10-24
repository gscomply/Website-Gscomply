import { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, List, ListOrdered,
  Link2, Unlink, Code, Code2, Table as TableIcon, Image as ImageIcon, Quote, Undo, Redo,
  Minus, Loader2, Upload, Rows3, Columns3, Trash2,
} from 'lucide-react';
import Modal, { btnPrimary, btnSecondary } from '@/components/admin/Modal';
import { uploadBlogImage, validateImage } from '@/lib/blogApi';

const tool =
  'p-2 rounded-md text-gray-600 hover:text-[#1A6B3C] hover:bg-[#1A6B3C]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed aria-pressed:bg-[#1A6B3C]/15 aria-pressed:text-[#1A6B3C]';

function Sep() {
  return <span className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />;
}

function ToolButton({
  label, onClick, active, disabled, children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active ?? undefined}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault() /* keep editor selection */}
      onClick={onClick}
      className={tool}
    >
      {children}
    </button>
  );
}

/** Turn what an editor types into a safe link target. Returns null if it is not acceptable. */
export function normaliseLink(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  if (/^(\/|#)/.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null; // javascript:, data:, etc.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  return `https://${v}`;
}

interface Props {
  initialHtml: string;
  onChange: (html: string) => void;
  onError: (message: string) => void;
}

export default function RichTextEditor({ initialHtml, onChange, onError }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [linkError, setLinkError] = useState('');
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] }, // h1 is the post title
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      TableKit.configure({ table: { resizable: false } }),
      ImageExtension.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content: initialHtml || '',
    editorProps: {
      attributes: {
        class: 'article-content ProseMirror px-5 py-4',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Article content',
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      bold: ed?.isActive('bold') ?? false,
      italic: ed?.isActive('italic') ?? false,
      underline: ed?.isActive('underline') ?? false,
      h2: ed?.isActive('heading', { level: 2 }) ?? false,
      h3: ed?.isActive('heading', { level: 3 }) ?? false,
      bullet: ed?.isActive('bulletList') ?? false,
      ordered: ed?.isActive('orderedList') ?? false,
      quote: ed?.isActive('blockquote') ?? false,
      link: ed?.isActive('link') ?? false,
      code: ed?.isActive('code') ?? false,
      codeBlock: ed?.isActive('codeBlock') ?? false,
      inTable: ed?.isActive('table') ?? false,
      canUndo: ed?.can().undo() ?? false,
      canRedo: ed?.can().redo() ?? false,
    }),
  });

  const openLink = useCallback(() => {
    if (!editor) return;
    setLinkValue((editor.getAttributes('link').href as string) || '');
    setLinkError('');
    setLinkOpen(true);
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;
    if (!linkValue.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setLinkOpen(false);
      return;
    }
    const href = normaliseLink(linkValue);
    if (!href) {
      setLinkError('Enter a web address (https://…), an email address, or a /path on this site.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkOpen(false);
  };

  const insertImage = (src: string, alt: string) => {
    editor?.chain().focus().setImage({ src, alt }).run();
  };

  const submitImage = async () => {
    const file = fileRef.current?.files?.[0];
    try {
      if (file) {
        const problem = validateImage(file);
        if (problem) throw new Error(problem);
        setUploading(true);
        const url = await uploadBlogImage(file, 'inline');
        insertImage(url, imageAlt);
      } else if (/^https:\/\//i.test(imageUrl.trim())) {
        insertImage(imageUrl.trim(), imageAlt);
      } else {
        onError('Choose an image file, or paste an https:// image address.');
        return;
      }
      closeImage();
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const closeImage = () => {
    setImageOpen(false);
    setImageUrl('');
    setImageAlt('');
    if (fileRef.current) fileRef.current.value = '';
  };

  if (!editor) {
    return <div className="h-[360px] rounded-lg border border-gray-200 bg-white animate-pulse" aria-label="Loading editor" />;
  }

  const c = () => editor.chain().focus();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden focus-within:border-[#1A6B3C] focus-within:ring-1 focus-within:ring-[#1A6B3C]/20">
      <div role="toolbar" aria-label="Formatting" className="flex items-center gap-0.5 p-2 border-b border-gray-100 bg-gray-50 flex-wrap">
        <ToolButton label="Bold" active={state.bold} onClick={() => c().toggleBold().run()}><Bold className="w-4 h-4" /></ToolButton>
        <ToolButton label="Italic" active={state.italic} onClick={() => c().toggleItalic().run()}><Italic className="w-4 h-4" /></ToolButton>
        <ToolButton label="Underline" active={state.underline} onClick={() => c().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></ToolButton>
        <Sep />
        <ToolButton label="Heading 2" active={state.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></ToolButton>
        <ToolButton label="Heading 3" active={state.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></ToolButton>
        <Sep />
        <ToolButton label="Bulleted list" active={state.bullet} onClick={() => c().toggleBulletList().run()}><List className="w-4 h-4" /></ToolButton>
        <ToolButton label="Numbered list" active={state.ordered} onClick={() => c().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></ToolButton>
        <ToolButton label="Quote" active={state.quote} onClick={() => c().toggleBlockquote().run()}><Quote className="w-4 h-4" /></ToolButton>
        <Sep />
        <ToolButton label="Add or edit link" active={state.link} onClick={openLink}><Link2 className="w-4 h-4" /></ToolButton>
        <ToolButton label="Remove link" disabled={!state.link} onClick={() => c().extendMarkRange('link').unsetLink().run()}><Unlink className="w-4 h-4" /></ToolButton>
        <Sep />
        <ToolButton label="Inline code" active={state.code} onClick={() => c().toggleCode().run()}><Code className="w-4 h-4" /></ToolButton>
        <ToolButton label="Code block" active={state.codeBlock} onClick={() => c().toggleCodeBlock().run()}><Code2 className="w-4 h-4" /></ToolButton>
        <ToolButton label="Insert table" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></ToolButton>
        <ToolButton label="Insert image" onClick={() => setImageOpen(true)}><ImageIcon className="w-4 h-4" /></ToolButton>
        <ToolButton label="Divider line" onClick={() => c().setHorizontalRule().run()}><Minus className="w-4 h-4" /></ToolButton>
        <Sep />
        <ToolButton label="Undo" disabled={!state.canUndo} onClick={() => c().undo().run()}><Undo className="w-4 h-4" /></ToolButton>
        <ToolButton label="Redo" disabled={!state.canRedo} onClick={() => c().redo().run()}><Redo className="w-4 h-4" /></ToolButton>

        {state.inTable && (
          <div className="flex items-center gap-0.5 w-full pt-2 mt-1 border-t border-gray-200 text-xs text-gray-500">
            <span className="px-2 font-medium">Table:</span>
            <ToolButton label="Add row below" onClick={() => c().addRowAfter().run()}><Rows3 className="w-4 h-4" /></ToolButton>
            <ToolButton label="Delete row" onClick={() => c().deleteRow().run()}><span className="text-[11px] font-semibold px-0.5">−Row</span></ToolButton>
            <ToolButton label="Add column after" onClick={() => c().addColumnAfter().run()}><Columns3 className="w-4 h-4" /></ToolButton>
            <ToolButton label="Delete column" onClick={() => c().deleteColumn().run()}><span className="text-[11px] font-semibold px-0.5">−Col</span></ToolButton>
            <ToolButton label="Toggle header row" onClick={() => c().toggleHeaderRow().run()}><span className="text-[11px] font-semibold px-0.5">Header</span></ToolButton>
            <ToolButton label="Delete table" onClick={() => c().deleteTable().run()}><Trash2 className="w-4 h-4 text-red-500" /></ToolButton>
          </div>
        )}
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <Modal
        open={linkOpen}
        title="Link"
        onClose={() => setLinkOpen(false)}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setLinkOpen(false)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={applyLink}>Apply</button>
          </>
        }
      >
        <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="link-url">Web address</label>
        <input
          id="link-url"
          type="text"
          value={linkValue}
          onChange={(e) => { setLinkValue(e.target.value); setLinkError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } }}
          placeholder="https://example.com"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C]"
        />
        {linkError && <p className="mt-2 text-xs text-red-600" role="alert">{linkError}</p>}
        <p className="mt-2 text-xs text-gray-400">Leave empty and apply to remove the link. Select the text first.</p>
      </Modal>

      <Modal
        open={imageOpen}
        title="Insert image"
        onClose={closeImage}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={closeImage} disabled={uploading}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={submitImage} disabled={uploading}>
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : 'Insert'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="img-file" className="block text-xs font-semibold text-gray-700 mb-1.5">
              <Upload className="inline w-3.5 h-3.5 mr-1 -mt-0.5" aria-hidden="true" />Upload from your computer
            </label>
            <input
              id="img-file"
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="block w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-[#1A6B3C]/10 file:text-[#1A6B3C] file:font-medium"
            />
            <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, GIF or AVIF, up to 5 MB.</p>
          </div>
          <div>
            <label htmlFor="img-url" className="block text-xs font-semibold text-gray-700 mb-1.5">…or paste an image address</label>
            <input
              id="img-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C]"
            />
          </div>
          <div>
            <label htmlFor="img-alt" className="block text-xs font-semibold text-gray-700 mb-1.5">Alt text (describe the image)</label>
            <input
              id="img-alt"
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export type { Editor };
