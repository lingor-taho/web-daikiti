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
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input
        className="admin-input"
        defaultValue={defaultValue ?? ""}
        name={name}
        placeholder="/images/example.jpg or https://..."
        required={required}
        type="text"
      />
      {helpText ? <small>{helpText}</small> : null}
    </label>
  );
}
