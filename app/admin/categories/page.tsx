import { prisma } from "@/lib/prisma";
import AddCategoryForm from "@/components/admin/AddCategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy mb-1">Catégories</h1>
      <p className="text-sm text-brand-slate/60 mb-8">
        Les formations sont classées dans ces catégories, affichées sur la page d'accueil.
      </p>

      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden mb-8 max-w-md">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-brand-slate/60">Aucune catégorie pour l'instant.</p>
        ) : (
          categories.map((c, i) => (
            <div
              key={c.id}
              className={`flex items-center justify-between px-5 py-3 ${i !== 0 ? "border-t border-brand-line" : ""}`}
            >
              <span className="text-sm font-medium text-brand-navy">{c.name}</span>
              <span className="text-xs text-brand-slate/50">{c._count.courses} formation(s)</span>
            </div>
          ))
        )}
      </div>

      <AddCategoryForm />
    </>
  );
}
