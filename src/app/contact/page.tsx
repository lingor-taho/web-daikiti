import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contact | DKT Motors",
  description: "Send a custom vehicle, parts, or maintenance inquiry to DKT Motors.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <p className="contact-hero__label">Contact</p>
          <h1>Talk with DKT Motors</h1>
          <p>
            Tell us about the vehicle, parts, or installation work you are considering. We will review
            the details and follow up with the next practical step.
          </p>
        </div>
      </section>

      <section className="section contact-section" aria-labelledby="contact-form-heading">
        <div className="container contact-layout">
          <div className="contact-layout__intro">
            <p className="section-heading__label">Inquiry Form</p>
            <h2 id="contact-form-heading">Send your request</h2>
            <p>
              Required fields are name, email, and message. Include the vehicle model, target use, and
              timing when those details are available.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
