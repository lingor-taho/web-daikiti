"use client";

import { useId, useRef, useState } from "react";

type ImageUploadFieldProps = {
  defaultValue?: string | null;
  helpText?: string;
  label: string;
  name: string;
  required?: boolean;
};

export function ImageUploadField({
  defaultValue,
  helpText,
  label,
  name,
  required = false,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const trimmedValue = value.trim();

  async function uploadSelectedFile() {
    if (!selectedFile) {
      setError("Choose an image file first.");
      return;
    }

    setError("");
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);

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

      setValue(result.url);
      setSelectedFile(null);
      setStatus("Uploaded.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (uploadError) {
      setStatus("");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  }

  return (
    <div className="admin-field admin-image-upload-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className="admin-input"
        onChange={(event) => setValue(event.target.value)}
        value={value}
        name={name}
        placeholder="/images/example.jpg or https://..."
        required={required}
        type="text"
      />
      <div className="admin-upload-controls">
        <input
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="admin-upload-controls__file"
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null);
            setError("");
            setStatus("");
          }}
          type="file"
        />
        <button
          className="admin-button admin-button--secondary admin-button--compact"
          disabled={!selectedFile || status === "Uploading..."}
          onClick={uploadSelectedFile}
          type="button"
        >
          Upload
        </button>
      </div>
      {trimmedValue ? (
        <div className="admin-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- Admin previews accept arbitrary pasted URLs. */}
          <img alt="" src={trimmedValue} />
        </div>
      ) : null}
      {helpText ? <small>{helpText}</small> : null}
      <div className="admin-upload-feedback" aria-live="polite">
        {selectedFile ? <span>{selectedFile.name}</span> : null}
        {status ? <span className="is-success">{status}</span> : null}
        {error ? <span className="is-error">{error}</span> : null}
      </div>
    </div>
  );
}
