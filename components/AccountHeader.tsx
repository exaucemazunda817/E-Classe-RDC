import Link from "next/link";
import Logo from "./Logo";
import SignOutButton from "./SignOutButton";

export default function AccountHeader({
  name,
  unreadMessages = 0,
}: {
  name: string;
  unreadMessages?: number;
}) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-40 bg-brand-navy border-b border-white/10">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo variant="light" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/account/messages"
            className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Messages"
          >
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
            <span className="text-sm font-semibold">✉</span>
          </Link>

          <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-display font-bold text-sm">
            {initial}
          </div>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
