"use client";

import { useRef, useState, type FormEvent } from "react";

type ContactField = "name" | "email" | "phone" | "inquiryType" | "message";

type ContactFormState = Record<ContactField, string>;

type ContactResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

const inquiryTypes = [
  "Custom build consultation",
  "Parts or installation",
  "Vehicle sourcing",
  "Maintenance",
  "Other",
];

export function ContactForm() {
  const isSubmittingRef = useRef(false);
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<ContactResponse["fieldErrors"]>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: ContactField, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setStatusMessage("");
    setIsSuccess(false);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setStatusMessage(result.message ?? "Unable to send your inquiry.");
        return;
      }

      setForm(initialFormState);
      setIsSuccess(true);
      setStatusMessage("Thank you. Your inquiry has been received.");
    } catch {
      setStatusMessage("Unable to send your inquiry. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {statusMessage ? (
        <p
          className={`contact-form__message ${isSuccess ? "is-success" : "is-error"}`}
          role={isSuccess ? "status" : "alert"}
        >
          {statusMessage}
        </p>
      ) : null}

      <div className="contact-form__grid">
        <label className="contact-field">
          <span>Name</span>
          <input
            aria-describedby={fieldErrors?.name ? "contact-name-error" : undefined}
            aria-invalid={fieldErrors?.name ? "true" : "false"}
            autoComplete="name"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            type="text"
            value={form.name}
          />
          {fieldErrors?.name ? (
            <small className="contact-field__error" id="contact-name-error">
              {fieldErrors.name[0]}
            </small>
          ) : null}
        </label>

        <label className="contact-field">
          <span>Email</span>
          <input
            aria-describedby={fieldErrors?.email ? "contact-email-error" : undefined}
            aria-invalid={fieldErrors?.email ? "true" : "false"}
            autoComplete="email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={form.email}
          />
          {fieldErrors?.email ? (
            <small className="contact-field__error" id="contact-email-error">
              {fieldErrors.email[0]}
            </small>
          ) : null}
        </label>

        <label className="contact-field">
          <span>Phone</span>
          <input
            aria-describedby={fieldErrors?.phone ? "contact-phone-error" : undefined}
            aria-invalid={fieldErrors?.phone ? "true" : "false"}
            autoComplete="tel"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            type="tel"
            value={form.phone}
          />
          {fieldErrors?.phone ? (
            <small className="contact-field__error" id="contact-phone-error">
              {fieldErrors.phone[0]}
            </small>
          ) : null}
        </label>

        <label className="contact-field">
          <span>Inquiry type</span>
          <select
            aria-describedby={fieldErrors?.inquiryType ? "contact-inquiry-type-error" : undefined}
            aria-invalid={fieldErrors?.inquiryType ? "true" : "false"}
            name="inquiryType"
            onChange={(event) => updateField("inquiryType", event.target.value)}
            value={form.inquiryType}
          >
            <option value="">Select an option</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldErrors?.inquiryType ? (
            <small className="contact-field__error" id="contact-inquiry-type-error">
              {fieldErrors.inquiryType[0]}
            </small>
          ) : null}
        </label>
      </div>

      <label className="contact-field">
        <span>Message</span>
        <textarea
          aria-describedby={fieldErrors?.message ? "contact-message-error" : undefined}
          aria-invalid={fieldErrors?.message ? "true" : "false"}
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          required
          rows={8}
          value={form.message}
        />
        {fieldErrors?.message ? (
          <small className="contact-field__error" id="contact-message-error">
            {fieldErrors.message[0]}
          </small>
        ) : null}
      </label>

      <div className="contact-form__actions">
        <button className="button button--dark" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send inquiry"}
        </button>
      </div>
    </form>
  );
}
