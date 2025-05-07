
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2,
  Pencil
} from "lucide-react";

interface Tip {
  id: number;
  content: string;
  category: string;
  addedOn: string;
  isActive: boolean;
}

const financialTips: Tip[] = [
  {
    id: 1,
    content: "خصص 20% من راتبك للادخار قبل بدء الإنفاق على المصروفات الأخرى.",
    category: "ادخار",
    addedOn: "10 مايو 2024",
    isActive: true,
  },
  {
    id: 2,
    content: "استخدم قاعدة 50/30/20 لتقسيم دخلك: 50% للضروريات، 30% للرغبات، و20% للادخار.",
    category: "ميزانية",
    addedOn: "12 مايو 2024",
    isActive: true,
  },
  {
    id: 3,
    content: "تتبع جميع مصروفاتك لمدة شهر كامل لفهم أنماط الإنفاق الخاصة بك.",
    category: "ميزانية",
    addedOn: "15 مايو 2024",
    isActive: true,
  },
];

const selfDevelopmentTips: Tip[] = [
  {
    id: 1,
    content: "اقرأ 20 دقيقة على الأقل يومياً لتوسيع معرفتك وتحسين مهاراتك.",
    category: "قراءة",
    addedOn: "8 مايو 2024",
    isActive: true,
  },
  {
    id: 2,
    content: "خصص وقتاً كل يوم للتأمل والتفكير الإيجابي.",
    category: "صحة عقلية",
    addedOn: "11 مايو 2024",
    isActive: true,
  },
  {
    id: 3,
    content: "تعلم مهارة جديدة كل شهر لتوسيع آفاقك.",
    category: "مهارات",
    addedOn: "14 مايو 2024",
    isActive: false,
  },
];

const habitBreakingTips: Tip[] = [
  {
    id: 1,
    content: "استبدل العادات السيئة بأخرى إيجابية بدلاً من محاولة التخلص منها فقط.",
    category: "استراتيجية",
    addedOn: "9 مايو 2024",
    isActive: true,
  },
  {
    id: 2,
    content: "قم بتتبع أيام النجاح المتتالية لتحفيز نفسك على الاستمرار.",
    category: "تحفيز",
    addedOn: "13 مايو 2024",
    isActive: true,
  },
];

export function TipsManager() {
  const [activeTab, setActiveTab] = useState("financial");
  const [tips, setTips] = useState({
    financial: financialTips,
    selfDevelopment: selfDevelopmentTips,
    habitBreaking: habitBreakingTips,
  });
  
  const [newTip, setNewTip] = useState({
    content: "",
    category: "",
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTipId, setEditingTipId] = useState<number | null>(null);
  
  const handleAddTip = () => {
    const currentDate = new Date().toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const tipCategory = activeTab === "financial" 
      ? "financial" 
      : activeTab === "selfDevelopment" 
        ? "selfDevelopment" 
        : "habitBreaking";
    
    if (isEditMode && editingTipId !== null) {
      setTips({
        ...tips,
        [tipCategory]: tips[tipCategory as keyof typeof tips].map(tip => 
          tip.id === editingTipId 
            ? { 
                ...tip, 
                content: newTip.content,
                category: newTip.category,
              } 
            : tip
        ),
      });
    } else {
      const newId = Math.max(...tips[tipCategory as keyof typeof tips].map(t => t.id), 0) + 1;
      setTips({
        ...tips,
        [tipCategory]: [
          ...tips[tipCategory as keyof typeof tips],
          {
            id: newId,
            content: newTip.content,
            category: newTip.category,
            addedOn: currentDate,
            isActive: true,
          }
        ],
      });
    }
    
    // Reset form
    setNewTip({
      content: "",
      category: "",
    });
    setIsEditMode(false);
    setEditingTipId(null);
    setIsDialogOpen(false);
  };
  
  const handleEdit = (tip: Tip) => {
    setIsEditMode(true);
    setEditingTipId(tip.id);
    setNewTip({
      content: tip.content,
      category: tip.category,
    });
    setIsDialogOpen(true);
  };
  
  const handleToggleStatus = (id: number) => {
    const tipCategory = activeTab === "financial" 
      ? "financial" 
      : activeTab === "selfDevelopment" 
        ? "selfDevelopment" 
        : "habitBreaking";
        
    setTips({
      ...tips,
      [tipCategory]: tips[tipCategory as keyof typeof tips].map(tip => 
        tip.id === id ? { ...tip, isActive: !tip.isActive } : tip
      ),
    });
  };
  
  const activeTips = activeTab === "financial" 
    ? tips.financial 
    : activeTab === "selfDevelopment" 
      ? tips.selfDevelopment 
      : tips.habitBreaking;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>إدارة النصائح والإرشادات</CardTitle>
          <CardDescription>
            أضف وعدّل النصائح التي تظهر للمستخدمين في مختلف أقسام التطبيق
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs 
            defaultValue="financial" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="financial">نصائح مالية</TabsTrigger>
                <TabsTrigger value="selfDevelopment">تطوير الذات</TabsTrigger>
                <TabsTrigger value="habitBreaking">كسر العادات</TabsTrigger>
              </TabsList>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    إضافة نصيحة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? "تعديل النصيحة" : "إضافة نصيحة جديدة"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode 
                        ? "قم بتعديل محتوى النصيحة الحالية" 
                        : "أدخل محتوى النصيحة الجديدة التي ستضاف إلى التطبيق."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tip-category">تصنيف النصيحة</Label>
                      <Input 
                        id="tip-category" 
                        value={newTip.category}
                        onChange={(e) => setNewTip({...newTip, category: e.target.value})}
                        placeholder="مثال: ادخار، ميزانية، قراءة"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tip-content">محتوى النصيحة</Label>
                      <Textarea 
                        id="tip-content" 
                        value={newTip.content}
                        onChange={(e) => setNewTip({...newTip, content: e.target.value})}
                        rows={4}
                        placeholder="اكتب نصيحة مفيدة ومختصرة..."
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddTip}>
                      {isEditMode ? "حفظ التغييرات" : "إضافة النصيحة"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <TabsContent value="financial" className="mt-4">
              <TipsTable tips={tips.financial} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
            </TabsContent>
            
            <TabsContent value="selfDevelopment" className="mt-4">
              <TipsTable tips={tips.selfDevelopment} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
            </TabsContent>
            
            <TabsContent value="habitBreaking" className="mt-4">
              <TipsTable tips={tips.habitBreaking} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface TipsTableProps {
  tips: Tip[];
  onEdit: (tip: Tip) => void;
  onToggleStatus: (id: number) => void;
}

function TipsTable({ tips, onEdit, onToggleStatus }: TipsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>المحتوى</TableHead>
            <TableHead className="w-28">التصنيف</TableHead>
            <TableHead className="w-28">تاريخ الإضافة</TableHead>
            <TableHead className="w-24">الحالة</TableHead>
            <TableHead className="w-24 text-left"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tips.length > 0 ? (
            tips.map((tip) => (
              <TableRow key={tip.id}>
                <TableCell>{tip.content}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tip.category}</Badge>
                </TableCell>
                <TableCell>{tip.addedOn}</TableCell>
                <TableCell>
                  <Button
                    variant={tip.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleStatus(tip.id)}
                    className={tip.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {tip.isActive ? "نشط" : "معطل"}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(tip)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                لا توجد نصائح في هذا القسم. أضف نصائح جديدة لمساعدة المستخدمين.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
