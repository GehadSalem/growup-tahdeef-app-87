import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
}

interface SubscriptionPlansTableProps {
  searchQuery?: string;
  filterStatus?: string[];
}

const initialPlans: Plan[] = [
  {
    id: "plan1",
    name: "الباقة الشهرية الأساسية",
    price: 49.99,
    interval: "شهري",
    features: ["تتبع الأهداف", "تخطيط مالي", "تطوير العادات"],
    isActive: true,
    isPopular: false,
  },
  {
    id: "plan2",
    name: "الباقة السنوية الأساسية",
    price: 499.99,
    interval: "سنوي",
    features: ["تتبع الأهداف", "تخطيط مالي", "تطوير العادات"],
    isActive: true,
    isPopular: true,
  },
  {
    id: "plan3",
    name: "الباقة الشهرية المتميزة",
    price: 99.99,
    interval: "شهري",
    features: ["تتبع الأهداف", "تخطيط مالي", "تطوير العادات", "استشارات شخصية", "تقارير متقدمة"],
    isActive: true,
    isPopular: false,
  },
  {
    id: "plan4",
    name: "الباقة السنوية المتميزة",
    price: 999.99,
    interval: "سنوي",
    features: ["تتبع الأهداف", "تخطيط مالي", "تطوير العادات", "استشارات شخصية", "تقارير متقدمة"],
    isActive: false,
    isPopular: false,
  },
];

export function SubscriptionPlansTable({ 
  searchQuery = "", 
  filterStatus = ["الكل"] 
}: SubscriptionPlansTableProps) {
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>(initialPlans);
  
  // تصفية الخطط حسب searchQuery و filterStatus
  const filteredPlans = subscriptionPlans.filter(plan => {
    // تطبيق البحث
    const matchesSearch = 
      plan.name.includes(searchQuery) ||
      plan.features.some(feature => feature.includes(searchQuery));
    
    // تطبيق التصفية
    const matchesFilter = 
      filterStatus.includes("الكل") || 
      (filterStatus.includes("نشط") && plan.isActive) ||
      (filterStatus.includes("غير نشط") && !plan.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const togglePlanStatus = (planId: string) => {
    setSubscriptionPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">إدارة خطط الاشتراك</h3>
        <Button size="sm">إضافة خطة جديدة</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الخطة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الميزات</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {plan.name}
                  {plan.isPopular && (
                    <Badge className="mr-2 bg-growup">الأكثر شعبية</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {plan.price} ج.م
                  <span className="text-muted-foreground text-xs mr-1">
                    / {plan.interval}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {plan.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={plan.isActive}
                    onCheckedChange={() => togglePlanStatus(plan.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">تعديل</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">حذف</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}