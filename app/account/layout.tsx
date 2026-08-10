import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AccountHeader from "@/components/AccountHeader";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const unreadMessages = await prisma.message.count({
    where: { userId: user.id, read: false, fromRole: { not: "STUDENT" } },
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <AccountHeader name={user.name} unreadMessages={unreadMessages} />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
