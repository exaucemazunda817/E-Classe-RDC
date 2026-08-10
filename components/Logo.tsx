export default function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const textColor = variant === "light" ? "text-white" : "text-brand-blue";

  return (
    <div className="flex items-center gap-2">
      <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0L30 7L16 14L2 7L16 0Z" fill={variant === "light" ? "#FFFFFF" : "#0F3D73"} />
        <path
          d="M6 10V18C6 18 10 20.5 16 20.5C22 20.5 26 18 26 18V10"
          stroke={variant === "light" ? "#FFFFFF" : "#0F3D73"}
          strokeWidth="1.5"
          fill="none"
        />
        <path d="M2 7V13" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className={`font-extrabold text-lg leading-none ${textColor}`}>
        E-CLASSE <span className="text-brand-orange">RDC</span>
      </span>
    </div>
  );
}
