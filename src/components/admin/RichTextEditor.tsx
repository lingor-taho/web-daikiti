"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";

type RichTextEditorProps = {
  initialValue?: string;
  labelledBy?: string;
  name: string;
};

export function RichTextEditor({ initialValue = "", labelledBy, name }: RichTextEditorProps) {
  const [html, setHtml] = useState(initialValue);
  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
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

  function addImageByUrl() {
    if (!editor) {
      return;
    }

    const src = window.prompt("Image URL");

    if (src?.trim()) {
      editor.chain().focus().setImage({ src: src.trim() }).run();
    }
  }

  async function uploadImage(file: File) {
    if (!editor) {
      return;
    }

    setImageUploadError("");
    setImageUploadStatus("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as
        | { error?: string; ok?: boolean; url?: string }
        | null;

      if (!response.ok || !result?.ok || !result.url) {
        throw new Error(result?.error ?? "Upload failed.");
      }

      editor.chain().focus().setImage({ src: result.url }).run();
      setImageUploadStatus("Image inserted.");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (uploadError) {
      setImageUploadStatus("");
      setImageUploadError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
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
          <button
            disabled={!editor || imageUploadStatus === "Uploading image..."}
            onClick={() => imageInputRef.current?.click()}
            type="button"
          >
            Upload image
          </button>
          <button disabled={!editor} onClick={addImageByUrl} type="button">
            Image URL
          </button>
          <input
            ref={imageInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void uploadImage(file);
              }
            }}
            type="file"
          />
          <span
            className={`admin-rich-editor__status${imageUploadError ? " is-error" : ""}`}
            aria-live="polite"
          >
            {imageUploadStatus || imageUploadError}
          </span>
        </div>
        <EditorContent className="admin-rich-editor__content" editor={editor} />
      </div>
    </>
  );
}
