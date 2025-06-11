import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon, FilterIcon, ChevronDown, MenuIcon } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";

export default function UsersPage() {
  const [filterStatus, setFilterStatus] = useState<string[]>(["الكل"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات المستخدمين بنجاح",
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* شريط التنقل لسطح المكتب */}
      <div className="hidden md:block">
        <AdminNav />
      </div>

      {/* الهيدر للجوال */}
      <header className="md:hidden sticky top-0 z-10 bg-background border-b p-4 flex items-center">
        <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent side="right" className="w-[280px]">
            <AdminNav isMobile onItemClick={() => setMobileNavOpen(false)} />
          </DrawerContent>
        </Drawer>
        <div className="mr-3">
                  <AdminHeader heading="المستخدمين" text="إدارة بيانات المستخدمين" />

        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* شريط البحث والتصفية */}
        <div className="mb-6">
          <div className="relative mb-3">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full text-sm bg-background"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>تصفية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("الكل")}
                  onCheckedChange={() => setFilterStatus(["الكل"])}
                >
                  الكل
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("نشط")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    setFilterStatus(
                      filterStatus.includes("نشط") 
                        ? filtered.filter(f => f !== "نشط") 
                        : [...filtered, "نشط"]
                    );
                  }}
                >
                  نشط
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("معلق")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    setFilterStatus(
                      filterStatus.includes("معلق") 
                        ? filtered.filter(f => f !== "معلق") 
                        : [...filtered, "معلق"]
                    );
                  }}
                >
                  معلق
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="flex-1" onClick={handleExportData}>
              تصدير البيانات
            </Button>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <UserTable searchQuery={searchQuery} filterStatus={filterStatus} />
      </main>
    </div>
  );
}