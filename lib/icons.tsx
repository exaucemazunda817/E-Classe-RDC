// Icônes en traits fins (style "line icons"), sans remplissage cartoon,
// pour garder un rendu sobre et professionnel.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconCode({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
    </svg>
  );
}

export function IconBriefcase({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
    </svg>
  );
}

export function IconGraduationCap({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3 3-2-2 3-3z" />
    </svg>
  );
}

export function IconBookOpen({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M2 5.5C4 4.5 8 4 12 5.5c4-1.5 8-1 10 0v13c-2-1-6-1.5-10 0-4-1.5-8-1-10 0v-13z" />
      <path d="M12 5.5v13" />
    </svg>
  );
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCoin({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15.5c0 1 1.3 1.8 3 1.8s3-.8 3-1.8-1.3-1.5-3-1.8-3-.8-3-1.8 1.3-1.8 3-1.8 3 .8 3 1.8M12 6.5v11" />
    </svg>
  );
}

export function IconMedal({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9 13.5L7 21l5-2.5L17 21l-2-7.5" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 8a3 3 0 1 1 0-6M15 14c2.8.3 5 2.8 5 6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3.5z" />
    </svg>
  );
}

export function IconHome({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconGrid({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

export function IconMessageCircle({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-3.5-.7L3 20l1-5.5A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconLogOut({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 3v13M7 12l5 5 5-5M4 21h16" />
    </svg>
  );
}

export function IconCreditCard({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 10h19" />
    </svg>
  );
}

export function IconSend({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M21 3L11 13M21 3l-6.5 18-4-8-8-4L21 3z" />
    </svg>
  );
}
