
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Plus, 
  ShieldAlert, 
  ShoppingBasket, 
  Car, 
  Home, 
  Coffee, 
  Pill, 
  ShoppingBag
} from "lucide-react";

interface ExpenseCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  budget: number;
  isDefault: boolean;
}

export function ExpenseCategoriesManager() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    { 
      id: 1, 
      name: "الطعام والشراب", 
      icon: <Coffee className="h-5 w-5" />, 
      color: "#34A853",
      description: "المصروفات المتعلقة بالطعام والمشروبات",
      budget: 1500,
      isDefault: true
    },
    { 
      id: 2, 
      name: "السكن", 
      icon: <Home className="h-5 w-5" />, 
      color: "#1A73E8",
      description: "الإيجار، فواتير المرافق، صيانة المنزل",
      budget: 3000,
      isDefault: true
    },
    { 
      id: 3, 
      name: "المواصلات", 
      icon: <Car className="h-5 w-5" />, 
      color: "#F9AB00",
      description: "وقود، مواصلات عامة، صيانة السيارة",
      budget: 800,
      isDefault: true
    },
    { 
      id: 4, 
      name: "المستلزمات الطبية", 
      icon: <Pill className="h-5 w-5" />, 
      color: "#D93025",
      description: "أدوية، مصروفات طبيب، تأمين صحي",
      budget: 500,
      isDefault: false
    },
    { 
      id: 5, 
      name: "التسوق", 
      icon: <ShoppingBag className="h-5 w-5" />, 
      color: "#9C27B0",
      description: "ملابس، أحذية، إكسسوارات",
      budget: 1000,
      isDefault: false
    },
  ]);
  
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#34A853",
    description: "",
    budget: 0,
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  
  const handleAddCategory = () => {
    if (isEditMode && editingCategoryId !== null) {
      setCategories(categories.map(category => 
        category.id === editingCategoryId 
          ? { 
              ...category, 
              name: newCategory.name,
              color: newCategory.color,
              description: newCategory.description,
              budget: newCategory.budget
            } 
          : category
      ));
    } else {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      setCategories([
        ...categories, 
        { 
          id: newId, 
          name: newCategory.name,
          icon: <ShoppingBasket className="h-5 w-5" />,
          color: newCategory.color,
          description: newCategory.description,
          budget: newCategory.budget,
          isDefault: false
        }
      ]);
    }
    
    // Reset form
    setNewCategory({
      name: "",
      color: "#34A853",
      description: "",
      budget: 0,
    });
    setIsEditMode(false);
    setEditingCategoryId(null);
    setIsDialogOpen(false);
  };
  
  const handleEdit = (category: ExpenseCategory) => {
    setIsEditMode(true);
    setEditingCategoryId(category.id);
    setNewCategory({
      name: category.name,
      color: category.color,
      description: category.description,
      budget: category.budget,
    });
    setIsDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>فئات المصروفات</CardTitle>
            <CardDescription>
              إدارة الفئات المتاحة للمستخدمين لتصنيف مصروفاتهم
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                فئة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "تعديل فئة المصروفات" : "إضافة فئة مصروفات جديدة"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "قم بتعديل معلومات الفئة الحالية" 
                    : "أدخل معلومات الفئة الجديدة التي ستضاف إلى التطبيق."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category-name">اسم الفئة</Label>
                  <Input 
                    id="category-name" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="مثال: مصروفات الترفيه"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category-description">وصف الفئة</Label>
                  <Input 
                    id="category-description" 
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="وصف قصير للفئة"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category-budget">الميزانية المقترحة</Label>
                  <Input 
                    id="category-budget" 
                    type="number"
                    value={newCategory.budget}
                    onChange={(e) => setNewCategory({...newCategory, budget: Number(e.target.value)})}
                    placeholder="مثال: 1000"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category-color">لون الفئة</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="category-color" 
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      className="w-12 h-10 p-1"
                    />
                    <Input 
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddCategory}>
                  {isEditMode ? "حفظ التغييرات" : "إضافة الفئة"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">اللون</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead className="hidden md:table-cell">الوصف</TableHead>
                <TableHead className="text-right">الميزانية المقترحة</TableHead>
                <TableHead className="text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div 
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: category.color }} 
                    />
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {category.icon}
                    </span>
                    {category.name}
                    {category.isDefault && (
                      <Badge variant="outline" className="mr-2 text-xs">
                        افتراضي
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {category.budget} ج.م
                  </TableCell>
                  <TableCell className="text-left">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(category)}
                      disabled={category.isDefault}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categories.some(cat => cat.isDefault) && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <ShieldAlert className="h-4 w-4 mr-2" />
              <span>الفئات الافتراضية لا يمكن تعديلها أو حذفها.</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
