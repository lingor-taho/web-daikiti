"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";

type ApiContactField = "name" | "email" | "phone" | "inquiryType" | "message";
type ContactField = ApiContactField | "nameKana";

type ContactFormState = Record<ContactField, string> & {
  privacyAccepted: boolean;
};

type ContactResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<ApiContactField, string[]>>;
};

const initialFormState: ContactFormState = {
  name: "",
  nameKana: "",
  email: "",
  phone: "",
  inquiryType: "お問い合わせ",
  message: "",
  privacyAccepted: false,
};

const inquiryTypes = ["車両販売について", "輸出について", "自動車改装について", "リサイクル事業について", "その他"];

export function ContactForm() {
  const isSubmittingRef = useRef(false);
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<ContactResponse["fieldErrors"]>({});
  const [nameKanaError, setNameKanaError] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: ContactField, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "nameKana") {
      setNameKanaError("");
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function updatePrivacyAccepted(privacyAccepted: boolean) {
    setForm((current) => ({
      ...current,
      privacyAccepted,
    }));
    setPrivacyError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const missingKana = form.nameKana.trim().length === 0;
    const missingPrivacy = !form.privacyAccepted;
    setNameKanaError(missingKana ? "お名前（カタカナ）を入力してください。" : "");
    setPrivacyError(missingPrivacy ? "プライバシーポリシーへの同意が必要です。" : "");

    if (missingKana || missingPrivacy) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setStatusMessage("");
    setIsSuccess(false);
    setFieldErrors({});

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      inquiryType: form.inquiryType,
      message: `お名前（カタカナ）：${form.nameKana}\n\n${form.message}`,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setStatusMessage(result.message ?? "送信内容をご確認ください。");
        return;
      }

      setForm(initialFormState);
      setIsSuccess(true);
      setStatusMessage("お問い合わせを受け付けました。担当者よりご連絡いたします。");
    } catch {
      setStatusMessage("送信できませんでした。時間をおいて再度お試しください。");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form contact-form--jp" onSubmit={handleSubmit} noValidate>
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
          <span>
            お名前 <em>必須</em>
          </span>
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
          <span>
            お名前（カタカナ） <em>必須</em>
          </span>
          <input
            aria-describedby={nameKanaError ? "contact-name-kana-error" : undefined}
            aria-invalid={nameKanaError ? "true" : "false"}
            autoComplete="off"
            name="nameKana"
            onChange={(event) => updateField("nameKana", event.target.value)}
            required
            type="text"
            value={form.nameKana}
          />
          {nameKanaError ? (
            <small className="contact-field__error" id="contact-name-kana-error">
              {nameKanaError}
            </small>
          ) : null}
        </label>

        <label className="contact-field">
          <span>
            メールアドレス <em>必須</em>
          </span>
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
          <span>
            電話番号 <em>必須</em>
          </span>
          <input
            aria-describedby={fieldErrors?.phone ? "contact-phone-error" : undefined}
            aria-invalid={fieldErrors?.phone ? "true" : "false"}
            autoComplete="tel"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            required
            type="tel"
            value={form.phone}
          />
          {fieldErrors?.phone ? (
            <small className="contact-field__error" id="contact-phone-error">
              {fieldErrors.phone[0]}
            </small>
          ) : null}
        </label>
      </div>

      <label className="contact-field">
        <span>お問い合わせ種別</span>
        <select
          aria-describedby={fieldErrors?.inquiryType ? "contact-inquiry-type-error" : undefined}
          aria-invalid={fieldErrors?.inquiryType ? "true" : "false"}
          name="inquiryType"
          onChange={(event) => updateField("inquiryType", event.target.value)}
          value={form.inquiryType}
        >
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

      <label className="contact-field">
        <span>
          お問い合わせ内容 <em>必須</em>
        </span>
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

      <div className="contact-form__privacy">
        <label>
          <input
            checked={form.privacyAccepted}
            onChange={(event) => updatePrivacyAccepted(event.target.checked)}
            required
            type="checkbox"
          />
          <span>
            このフォームから送信された情報は、<Link href="/privacy">プライバシーポリシー</Link>に基づいて処理されます。
            内容に同意して送信します。
          </span>
        </label>
        {privacyError ? <small className="contact-field__error">{privacyError}</small> : null}
      </div>

      <div className="contact-form__actions">
        <button className="button button--dark" disabled={isSubmitting} type="submit">
          {isSubmitting ? "送信中..." : "送信する"}
        </button>
      </div>
    </form>
  );
}
