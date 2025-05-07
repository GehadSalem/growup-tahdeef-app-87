
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchIcon, FilterIcon, ChevronDown } from "lucide-react";
import { UserTable } from "@/components/admin/UserTable";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
  const [filterStatus, setFilterStatus] = useState<string[]>(["الكل"]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const handleExportData = () => {
    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات المستخدمين بنجاح",
    });
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AdminHeader heading="المستخدمين" text="إدارة وتحليل بيانات المستخدمين" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 md:w-80">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2 self-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
                  <FilterIcon className="h-4 w-4" />
                  <span>تصفية</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
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
                    if (filterStatus.includes("نشط")) {
                      setFilterStatus(filtered.filter(f => f !== "نشط"));
                    } else {
                      setFilterStatus([...filtered, "نشط"]);
                    }
                  }}
                >
                  نشط
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("معلق")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    if (filterStatus.includes("معلق")) {
                      setFilterStatus(filtered.filter(f => f !== "معلق"));
                    } else {
                      setFilterStatus([...filtered, "معلق"]);
                    }
                  }}
                >
                  معلق
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("مشترك")}
                  onCheckedChange={() => {
                    const filtered = filterStatus.filter(f => f !== "الكل");
                    if (filterStatus.includes("مشترك")) {
                      setFilterStatus(filtered.filter(f => f !== "مشترك"));
                    } else {
                      setFilterStatus([...filtered, "مشترك"]);
                    }
                  }}
                >
                  مشترك
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" className="h-8" onClick={handleExportData}>
              تصدير البيانات
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <UserTable searchQuery={searchQuery} filterStatus={filterStatus} />
        </div>
      </div>
    </div>
  );
}
