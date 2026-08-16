import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeleteContactMessageButton from "@/components/admin/DeleteContactMessageButton";
import { IconChevronRight } from "@/lib/icons";

export default async function ContactMessageDetailPage({ params }: { params: { id: string } }) {
  const message = await prisma.contactMessage.findUnique({ where: { id: params.id } });
  if (!message) notFound();

  if (!message.read) {
    await prisma.contactMessage.update({ where: { id: message.id }, data: { read: true } });
  }

  const mailtoHref = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.subject}`
  )}`;

  return (
    <>
      <Link
        href="/admin/contact-messages"
        className="inline-flex items-center gap-1 text-sm text-brand-slate/60 hover:text-brand-navy mb-4"
      >
        <IconChevronRight className="w-4 h-4 rotate-180" /> Retour aux messages
      </Link>

      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">
        {message.subject}
      </h1>
      <p className="text-sm text-brand-slate/60 mb-8">
        {new Date(message.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <InfoBlock label="Nom" value={message.name} />
        <InfoBlock label="Email" value={message.email} />
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-5 mb-8">
        <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-2">
          Message
        </p>
        <p className="text-sm text-brand-slate/80 leading-relaxed whitespace-pre-wrap">
          {message.message}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white text-sm font-semibold px-6 py-2.5 rounded-full"
        >
          Répondre par email
        </a>
        <DeleteContactMessageButton messageId={message.id} />
      </div>
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-line bg-white px-4 py-3">
      <p className="text-xs font-semibold text-brand-slate/50 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-brand-navy font-medium truncate">{value}</p>
    </div>
  );
}
