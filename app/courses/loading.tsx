export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="h-3 w-24 bg-brand-line rounded mb-3 animate-pulse" />
      <div className="h-9 w-72 bg-brand-line rounded mb-10 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-brand-line overflow-hidden">
            <div className="h-28 bg-brand-line animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-brand-line rounded animate-pulse" />
              <div className="h-4 w-full bg-brand-line rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-brand-line rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
