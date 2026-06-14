"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

type RichTextEditorProps = {
  initialValue?: string;
  labelledBy?: string;
  name: string;
};

export function RichTextEditor({ initialValue = "", labelledBy, name }: RichTextEditorProps) {
  const [html, setHtml] = useState(initialValue);
  const editorAttributes: Record<string, string> = labelledBy
    ? { "aria-labelledby": labelledBy }
    : { "aria-label": "Rich text body" };
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
      }),
      Image,
    ],
    content: initialValue,
    editorProps: {
      attributes: editorAttributes,
    },
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      setHtml(currentEditor.getHTML());
    },
  });

  function setLink() {
    if (!editor) {
      return;
    }

    const currentHref = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", currentHref ?? "");

    if (href === null) {
      return;
    }

    if (href.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  function addImage() {
    if (!editor) {
      return;
    }

    const src = window.prompt("Image URL");

    if (src?.trim()) {
      editor.chain().focus().setImage({ src: src.trim() }).run();
    }
  }

  return (
    <>
      <input name={name} type="hidden" value={html} />
      <div className="admin-rich-editor" role="group" aria-labelledby={labelledBy}>
        <div className="admin-rich-editor__toolbar" aria-label="Rich text tools">
          <button
            className={editor?.isActive("heading", { level: 2 }) ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            type="button"
          >
            H2
          </button>
          <button
            className={editor?.isActive("heading", { level: 3 }) ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            type="button"
          >
            H3
          </button>
          <button
            className={editor?.isActive("bold") ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            type="button"
          >
            B
          </button>
          <button
            className={editor?.isActive("italic") ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            type="button"
          >
            I
          </button>
          <button
            className={editor?.isActive("bulletList") ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            type="button"
          >
            List
          </button>
          <button
            className={editor?.isActive("orderedList") ? "is-active" : ""}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            type="button"
          >
            1.
          </button>
          <button
            className={editor?.isActive("link") ? "is-active" : ""}
            disabled={!editor}
            onClick={setLink}
            type="button"
          >
            Link
          </button>
          <button disabled={!editor} onClick={addImage} type="button">
            Image
          </button>
        </div>
        <EditorContent className="admin-rich-editor__content" editor={editor} />
      </div>
    </>
  );
}
