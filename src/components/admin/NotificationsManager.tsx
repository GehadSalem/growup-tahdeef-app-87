
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  Bell,
  Calendar,
  Check,
  Clock,
  Edit,
  Plus, 
  Send,
  Target,
  Trash2
} from "lucide-react";

interface NotificationTemplate {
  id: number;
  title: string;
  content: string;
  type: string;
  trigger: string;
  isActive: boolean;
}

export function NotificationsManager() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: 1,
      title: "تذكير بتتبع المصروفات",
      content: "مرحباً! لم تسجل أي مصروفات اليوم، هل تريد إضافتها الآن؟",
      type: "تذكير",
      trigger: "يومي",
      isActive: true,
    },
    {
      id: 2,
      title: "تحديث الميزانية الشهرية",
      content: "حان الوقت لتحديث ميزانيتك للشهر الجديد. هل تود مراجعة أهدافك المالية؟",
      type: "إشعار",
      trigger: "شهري",
      isActive: true,
    },
    {
      id: 3,
      title: "تهنئة بتحقيق هدف",
      content: "تهانينا! لقد حققت هدفك المالي. استمر في العمل الجيد!",
      type: "تهنئة",
      trigger: "إنجاز",
      isActive: true,
    },
    {
      id: 4,
      title: "تحديث التطبيق",
      content: "تم إصدار نسخة جديدة من التطبيق مع ميزات جديدة! حدث الآن للاستفادة منها.",
      type: "نظام",
      trigger: "تحديث",
      isActive: false,
    },
  ]);
  
  const [scheduledNotifications, setScheduledNotifications] = useState([
    {
      id: 1,
      title: "تحديث الميزانية الشهرية",
      audience: "جميع المستخدمين",
      scheduledFor: "1 يونيو 2024",
      status: "مجدول",
    },
    {
      id: 2,
      title: "نصائح لتوفير المال خلال رمضان",
      audience: "المستخدمين النشطين",
      scheduledFor: "20 فبراير 2025",
      status: "مجدول",
    },
  ]);
  
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    content: "",
    type: "تذكير",
    trigger: "يومي",
    isActive: true,
  });
  
  const [newScheduledNotification, setNewScheduledNotification] = useState({
    templateId: "",
    audience: "all",
    scheduledDate: "",
  });
  
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  
  const handleAddTemplate = () => {
    if (isEditMode && editingTemplateId !== null) {
      setTemplates(templates.map(template => 
        template.id === editingTemplateId 
          ? { 
              ...template, 
              title: newTemplate.title,
              content: newTemplate.content,
              type: newTemplate.type,
              trigger: newTemplate.trigger,
              isActive: newTemplate.isActive,
            } 
          : template
      ));
    } else {
      const newId = Math.max(...templates.map(t => t.id), 0) + 1;
      setTemplates([
        ...templates, 
        { 
          id: newId,
          title: newTemplate.title,
          content: newTemplate.content,
          type: newTemplate.type,
          trigger: newTemplate.trigger,
          isActive: newTemplate.isActive,
        }
      ]);
    }
    
    // Reset form
    setNewTemplate({
      title: "",
      content: "",
      type: "تذكير",
      trigger: "يومي",
      isActive: true,
    });
    setIsEditMode(false);
    setEditingTemplateId(null);
    setIsTemplateDialogOpen(false);
  };
  
  const handleScheduleNotification = () => {
    const selectedTemplate = templates.find(t => t.id === Number(newScheduledNotification.templateId));
    
    if (selectedTemplate) {
      const newId = Math.max(...scheduledNotifications.map(n => n.id), 0) + 1;
      setScheduledNotifications([
        ...scheduledNotifications,
        {
          id: newId,
          title: selectedTemplate.title,
          audience: newScheduledNotification.audience === "all" 
            ? "جميع المستخدمين" 
            : newScheduledNotification.audience === "active"
              ? "المستخدمين النشطين"
              : "المستخدمين غير النشطين",
          scheduledFor: newScheduledNotification.scheduledDate,
          status: "مجدول"
        }
      ]);
    }
    
    // Reset form
    setNewScheduledNotification({
      templateId: "",
      audience: "all",
      scheduledDate: "",
    });
    setIsScheduleDialogOpen(false);
  };
  
  const handleEditTemplate = (template: NotificationTemplate) => {
    setIsEditMode(true);
    setEditingTemplateId(template.id);
    setNewTemplate({
      title: template.title,
      content: template.content,
      type: template.type,
      trigger: template.trigger,
      isActive: template.isActive,
    });
    setIsTemplateDialogOpen(true);
  };
  
  const handleToggleStatus = (id: number) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, isActive: !template.isActive } : template
    ));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>قوالب الإشعارات</CardTitle>
            <CardDescription>
              إنشاء وتعديل قوالب الإشعارات التي تظهر للمستخدمين
            </CardDescription>
          </div>
          
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                قالب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "تعديل قالب الإشعار" : "إنشاء قالب إشعار جديد"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "قم بتعديل محتوى قالب الإشعار الحالي" 
                    : "أدخل تفاصيل قالب الإشعار الجديد الذي سيتم استخدامه في التطبيق."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="notification-title">عنوان الإشعار</Label>
                  <Input 
                    id="notification-title" 
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                    placeholder="مثال: تذكير بتتبع المصروفات"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notification-content">محتوى الإشعار</Label>
                  <Textarea 
                    id="notification-content" 
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                    rows={3}
                    placeholder="اكتب نص الإشعار هنا..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-type">نوع الإشعار</Label>
                    <Select 
                      value={newTemplate.type}
                      onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}
                    >
                      <SelectTrigger id="notification-type">
                        <SelectValue placeholder="اختر نوع الإشعار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تذكير">تذكير</SelectItem>
                        <SelectItem value="إشعار">إشعار</SelectItem>
                        <SelectItem value="تهنئة">تهنئة</SelectItem>
                        <SelectItem value="نظام">نظام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-trigger">وقت الإرسال</Label>
                    <Select 
                      value={newTemplate.trigger}
                      onValueChange={(value) => setNewTemplate({...newTemplate, trigger: value})}
                    >
                      <SelectTrigger id="notification-trigger">
                        <SelectValue placeholder="اختر وقت الإرسال" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="يومي">يومي</SelectItem>
                        <SelectItem value="أسبوعي">أسبوعي</SelectItem>
                        <SelectItem value="شهري">شهري</SelectItem>
                        <SelectItem value="إنجاز">عند تحقيق هدف</SelectItem>
                        <SelectItem value="تحديث">عند تحديث التطبيق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse pt-2">
                  <Switch 
                    id="notification-status"
                    checked={newTemplate.isActive}
                    onCheckedChange={(checked) => setNewTemplate({...newTemplate, isActive: checked})}
                  />
                  <Label htmlFor="notification-status">تفعيل الإشعار</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddTemplate}>
                  {isEditMode ? "حفظ التغييرات" : "إنشاء القالب"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead className="hidden md:table-cell">المحتوى</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>التشغيل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {template.content.length > 50 
                      ? `${template.content.substring(0, 50)}...` 
                      : template.content}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        template.type === "تذكير" ? "bg-blue-500" :
                        template.type === "إشعار" ? "bg-green-500" :
                        template.type === "تهنئة" ? "bg-amber-500" :
                        "bg-gray-500"
                      }
                    >
                      {template.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.trigger}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={template.isActive}
                      onCheckedChange={() => handleToggleStatus(template.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>الإشعارات المجدولة</CardTitle>
            <CardDescription>
              جدولة إرسال الإشعارات إلى المستخدمين في أوقات محددة
            </CardDescription>
          </div>
          
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Calendar className="h-4 w-4" />
                جدولة إشعار
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>جدولة إشعار جديد</DialogTitle>
                <DialogDescription>
                  اختر قالب الإشعار والجمهور المستهدف وموعد الإرسال.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="template-select">قالب الإشعار</Label>
                  <Select
                    value={newScheduledNotification.templateId}
                    onValueChange={(value) => setNewScheduledNotification({
                      ...newScheduledNotification, 
                      templateId: value
                    })}
                  >
                    <SelectTrigger id="template-select">
                      <SelectValue placeholder="اختر قالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(template => template.isActive)
                        .map(template => (
                          <SelectItem 
                            key={template.id} 
                            value={template.id.toString()}
                          >
                            {template.title}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="audience-select">الجمهور المستهدف</Label>
                  <Select
                    value={newScheduledNotification.audience}
                    onValueChange={(value) => setNewScheduledNotification({
                      ...newScheduledNotification, 
                      audience: value
                    })}
                  >
                    <SelectTrigger id="audience-select">
                      <SelectValue placeholder="اختر الجمهور المستهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المستخدمين</SelectItem>
                      <SelectItem value="active">المستخدمين النشطين</SelectItem>
                      <SelectItem value="inactive">المستخدمين غير النشطين</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="schedule-date">موعد الإرسال</Label>
                  <Input 
                    id="schedule-date" 
                    type="date" 
                    value={newScheduledNotification.scheduledDate}
                    onChange={(e) => setNewScheduledNotification({
                      ...newScheduledNotification, 
                      scheduledDate: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleScheduleNotification}>
                  جدولة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الإشعار</TableHead>
                <TableHead>الجمهور المستهدف</TableHead>
                <TableHead>موعد الإرسال</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledNotifications.length > 0 ? (
                scheduledNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>{notification.audience}</TableCell>
                    <TableCell>{notification.scheduledFor}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          notification.status === "مجدول" ? "bg-blue-500" :
                          notification.status === "مرسل" ? "bg-green-500" :
                          "bg-gray-500"
                        }
                      >
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-0 ml-2" />
                          إرسال الآن
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    لا توجد إشعارات مجدولة. قم بجدولة إشعار جديد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
