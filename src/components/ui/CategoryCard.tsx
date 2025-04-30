
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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

const categories = [
  {
    id: "self-development",
    title: "تطوير الذات",
    description: "طور مهاراتك وعاداتك الإيجابية",
    icon: "📚",
    route: "/self-development",
    color: "bg-purple-100"
  },
  {
    id: "break-habits",
    title: "كسر العادات السيئة",
    description: "تخلص من العادات السيئة خطوة بخطوة",
    icon: "🎯",
    route: "/break-habits",
    color: "bg-red-100"
  },
  {
    id: "dashboard",
    title: "لوحة التحكم",
    description: "نظرة عامة على تقدمك اليومي",
    icon: "📊",
    route: "/dashboard",
    color: "bg-blue-100"
  }
];

export function CategoriesSection() {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} {...category} />
      ))}
    </section>
  );
}
