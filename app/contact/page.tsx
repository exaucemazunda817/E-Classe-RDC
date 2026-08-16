import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — E-Classe RDC",
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-navy">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="eyebrow text-brand-orange mb-2">Contact</p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
            Une question ? Écris-nous.
          </h1>
          <p className="text-white/70 mt-4 leading-relaxed max-w-xl">
            Que ce soit à propos d'une formation, d'un paiement ou d'un partenariat, notre équipe
            te répond directement par email.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <ContactForm />
      </section>

      <Footer />
    </>
  );
}
