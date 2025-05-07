
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
  Target,
  Plus, 
  Trash2,
  Pencil, 
  Flame,
  Heart,
  BookOpen,
  Briefcase,
  DollarSign,
  Home
} from "lucide-react";

interface GoalTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  suggestedDuration: string;
  difficulty: string;
  milestones: string[];
  icon: React.ReactNode;
}

const financialGoals: GoalTemplate[] = [
  {
    id: 1,
    title: "بناء صندوق طوارئ",
    description: "ادخار مبلغ يكفي لتغطية مصاريف 3-6 أشهر",
    category: "ادخار",
    suggestedDuration: "6 أشهر",
    difficulty: "متوسط",
    milestones: [
      "ادخار ما يعادل مصاريف شهر واحد",
      "ادخار ما يعادل مصاريف 3 أشهر",
      "ادخار ما يعادل مصاريف 6 أشهر"
    ],
    icon: <DollarSign />,
  },
  {
    id: 2,
    title: "سداد الديون",
    description: "التخلص من جميع الديون بخطة مدروسة",
    category: "ادخار",
    suggestedDuration: "12 شهر",
    difficulty: "صعب",
    milestones: [
      "حصر جميع الديون وترتيبها حسب الأولوية",
      "سداد 50% من الديون",
      "سداد 100% من الديون"
    ],
    icon: <DollarSign />,
  },
];

const personalGoals: GoalTemplate[] = [
  {
    id: 1,
    title: "قراءة 12 كتاب في السنة",
    description: "تنمية عادة القراءة واكتساب المعرفة",
    category: "معرفة",
    suggestedDuration: "12 شهر",
    difficulty: "متوسط",
    milestones: [
      "قراءة 3 كتب",
      "قراءة 6 كتب",
      "قراءة 9 كتب",
      "قراءة 12 كتاب"
    ],
    icon: <BookOpen />,
  },
  {
    id: 2,
    title: "تحسين اللياقة البدنية",
    description: "بناء عادة التمرين المنتظم للحفاظ على الصحة",
    category: "صحة",
    suggestedDuration: "6 أشهر",
    difficulty: "متوسط",
    milestones: [
      "ممارسة الرياضة مرتين أسبوعياً لمدة شهر",
      "ممارسة الرياضة 3-4 مرات أسبوعياً لمدة 3 أشهر",
      "ممارسة الرياضة 5 مرات أسبوعياً بانتظام"
    ],
    icon: <Heart />,
  },
];

const careerGoals: GoalTemplate[] = [
  {
    id: 1,
    title: "تعلم مهارة جديدة",
    description: "اكتساب مهارة مهنية جديدة لتطوير المسار الوظيفي",
    category: "تطوير مهني",
    suggestedDuration: "3 أشهر",
    difficulty: "متوسط",
    milestones: [
      "تحديد المهارة والموارد المناسبة للتعلم",
      "إكمال 50% من مواد التعلم",
      "إتقان المهارة وتطبيقها في مشروع عملي"
    ],
    icon: <Briefcase />,
  },
  {
    id: 2,
    title: "إطلاق مشروع جانبي",
    description: "بدء مشروع جانبي لزيادة الدخل وتنمية المهارات",
    category: "ريادة أعمال",
    suggestedDuration: "6 أشهر",
    difficulty: "صعب",
    milestones: [
      "تحديد فكرة المشروع وإجراء بحث السوق",
      "تطوير نموذج أولي للمنتج/الخدمة",
      "إطلاق المشروع وتحقيق الإيرادات الأولى"
    ],
    icon: <Briefcase />,
  },
];

export function GoalsManager() {
  const [activeTab, setActiveTab] = useState("financial");
  const [goals, setGoals] = useState({
    financial: financialGoals,
    personal: personalGoals,
    career: careerGoals,
  });
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    suggestedDuration: "",
    difficulty: "متوسط",
    milestones: [""],
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  
  const handleAddGoal = () => {
    const goalCategory = activeTab === "financial" 
      ? "financial" 
      : activeTab === "personal" 
        ? "personal" 
        : "career";
    
    if (isEditMode && editingGoalId !== null) {
      setGoals({
        ...goals,
        [goalCategory]: goals[goalCategory as keyof typeof goals].map(goal => 
          goal.id === editingGoalId 
            ? { 
                ...goal, 
                title: newGoal.title,
                description: newGoal.description,
                category: newGoal.category,
                suggestedDuration: newGoal.suggestedDuration,
                difficulty: newGoal.difficulty,
                milestones: newGoal.milestones.filter(m => m.trim() !== ""),
              } 
            : goal
        ),
      });
    } else {
      const newId = Math.max(...goals[goalCategory as keyof typeof goals].map(g => g.id), 0) + 1;
      setGoals({
        ...goals,
        [goalCategory]: [
          ...goals[goalCategory as keyof typeof goals],
          {
            id: newId,
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            suggestedDuration: newGoal.suggestedDuration,
            difficulty: newGoal.difficulty,
            milestones: newGoal.milestones.filter(m => m.trim() !== ""),
            icon: goalCategory === "financial" ? <DollarSign /> : 
                 goalCategory === "personal" ? <Heart /> : <Briefcase />,
          }
        ],
      });
    }
    
    // Reset form
    setNewGoal({
      title: "",
      description: "",
      category: "",
      suggestedDuration: "",
      difficulty: "متوسط",
      milestones: [""],
    });
    setIsEditMode(false);
    setEditingGoalId(null);
    setIsDialogOpen(false);
  };
  
  const handleEdit = (goal: GoalTemplate) => {
    setIsEditMode(true);
    setEditingGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      suggestedDuration: goal.suggestedDuration,
      difficulty: goal.difficulty,
      milestones: [...goal.milestones],
    });
    setIsDialogOpen(true);
  };
  
  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, ""],
    });
  };
  
  const updateMilestone = (index: number, value: string) => {
    const updatedMilestones = [...newGoal.milestones];
    updatedMilestones[index] = value;
    setNewGoal({
      ...newGoal,
      milestones: updatedMilestones,
    });
  };
  
  const removeMilestone = (index: number) => {
    const updatedMilestones = newGoal.milestones.filter((_, i) => i !== index);
    setNewGoal({
      ...newGoal,
      milestones: updatedMilestones,
    });
  };
  
  const activeGoals = activeTab === "financial" 
    ? goals.financial 
    : activeTab === "personal" 
      ? goals.personal 
      : goals.career;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>قوالب الأهداف المقترحة</CardTitle>
          <CardDescription>
            إدارة قوالب الأهداف التي يمكن للمستخدمين اختيارها
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
                <TabsTrigger value="financial">أهداف مالية</TabsTrigger>
                <TabsTrigger value="personal">أهداف شخصية</TabsTrigger>
                <TabsTrigger value="career">أهداف مهنية</TabsTrigger>
              </TabsList>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    هدف جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? "تعديل هدف" : "إضافة هدف جديد"}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode 
                        ? "قم بتعديل معلومات الهدف الحالي" 
                        : "أدخل معلومات الهدف الجديد الذي سيتم اقتراحه للمستخدمين."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="goal-title">عنوان الهدف</Label>
                        <Input 
                          id="goal-title" 
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                          placeholder="مثال: توفير مبلغ للطوارئ"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="goal-category">تصنيف الهدف</Label>
                        <Input 
                          id="goal-category" 
                          value={newGoal.category}
                          onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                          placeholder="مثال: ادخار، صحة، تعليم"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="goal-description">وصف الهدف</Label>
                      <Textarea 
                        id="goal-description" 
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        placeholder="اكتب وصفاً واضحاً للهدف..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="goal-duration">المدة المقترحة</Label>
                        <Input 
                          id="goal-duration" 
                          value={newGoal.suggestedDuration}
                          onChange={(e) => setNewGoal({...newGoal, suggestedDuration: e.target.value})}
                          placeholder="مثال: 3 أشهر، 6 أشهر، سنة"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="goal-difficulty">مستوى الصعوبة</Label>
                        <Select 
                          value={newGoal.difficulty}
                          onValueChange={(value) => setNewGoal({...newGoal, difficulty: value})}
                        >
                          <SelectTrigger id="goal-difficulty">
                            <SelectValue placeholder="اختر مستوى الصعوبة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="سهل">سهل</SelectItem>
                            <SelectItem value="متوسط">متوسط</SelectItem>
                            <SelectItem value="صعب">صعب</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>الإنجازات المرحلية</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addMilestone}
                        >
                          <Plus className="h-4 w-4 mr-0 ml-1" />
                          إضافة مرحلة
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {newGoal.milestones.map((milestone, index) => (
                          <div key={index} className="flex gap-2">
                            <Input 
                              value={milestone}
                              onChange={(e) => updateMilestone(index, e.target.value)}
                              placeholder={`المرحلة ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMilestone(index)}
                              disabled={newGoal.milestones.length <= 1}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddGoal}>
                      {isEditMode ? "حفظ التغييرات" : "إضافة الهدف"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <TabsContent value="financial" className="space-y-4 mt-4">
              <GoalsTable goals={goals.financial} onEdit={handleEdit} />
            </TabsContent>
            
            <TabsContent value="personal" className="space-y-4 mt-4">
              <GoalsTable goals={goals.personal} onEdit={handleEdit} />
            </TabsContent>
            
            <TabsContent value="career" className="space-y-4 mt-4">
              <GoalsTable goals={goals.career} onEdit={handleEdit} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface GoalsTableProps {
  goals: GoalTemplate[];
  onEdit: (goal: GoalTemplate) => void;
}

function GoalsTable({ goals, onEdit }: GoalsTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الهدف</TableHead>
            <TableHead className="hidden md:table-cell">الوصف</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead>المدة المقترحة</TableHead>
            <TableHead>الصعوبة</TableHead>
            <TableHead className="text-left"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-growup">
                      {goal.icon}
                    </span>
                    {goal.title}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {goal.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{goal.category}</Badge>
                </TableCell>
                <TableCell>{goal.suggestedDuration}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      goal.difficulty === "سهل" ? "bg-green-500" :
                      goal.difficulty === "متوسط" ? "bg-yellow-500" :
                      "bg-red-500"
                    }
                  >
                    {goal.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(goal)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                لا توجد أهداف في هذا القسم. أضف أهدافاً جديدة لمساعدة المستخدمين.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
