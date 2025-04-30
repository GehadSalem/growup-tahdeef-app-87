
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { CategoryItem } from "@/lib/types";
import { APP_CATEGORIES } from "@/lib/constants";

interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

export function CategoryCard({ id, title, description, icon, route, color }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)}
      className="flex flex-col items-center justify-center rounded-xl border p-4 shadow-md transition-colors hover:border-growup/30 hover:bg-growup/5"
    >
      <div className={cn("rounded-full p-3", color)}>
        <span>{icon}</span>
      </div>
      <h3 className="mt-2 font-cairo font-semibold">{title}</h3>
      <p className="text-center text-sm text-gray-500">{description}</p>
    </button>
  );
}

export function CategoriesSection() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {APP_CATEGORIES.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </section>
  );
}
