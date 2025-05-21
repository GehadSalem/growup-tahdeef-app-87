
import { Gift } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";

export function ReferralIntro() {
  return (
    <div className="bg-gradient-to-l from-growup/30 to-growup/5 p-6 relative">
      <div className="absolute top-4 right-4">
        <Gift className="h-12 w-12 text-growup opacity-30" />
      </div>
      <CardTitle className="text-2xl font-bold mb-2">نظام الإحالة</CardTitle>
      <CardDescription className="text-lg">
        ادع أصدقاءك واحصل على شهر مجاني من اشتراك GrowUp Premium لكل صديق ينضم!
      </CardDescription>
    </div>
  );
}
