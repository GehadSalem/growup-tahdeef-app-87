
import { Star } from "lucide-react";
import { ProfileData } from "@/lib/types";

interface ReferralStatsProps {
  referralData: ProfileData;
}

export function ReferralStats({ referralData }: ReferralStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="p-3 bg-growup/10 rounded-lg">
        <p className="text-2xl font-bold mb-1">{referralData.referralCount || 0}</p>
        <p className="text-sm text-gray-600">الدعوات المقبولة</p>
      </div>
      
      <div className="p-3 bg-growup/10 rounded-lg">
        <p className="text-2xl font-bold mb-1">{referralData.freeMonthsEarned || 0}</p>
        <p className="text-sm text-gray-600">شهور مجانية</p>
      </div>
      
      <div className="p-3 bg-growup/10 rounded-lg relative overflow-hidden">
        <div className="absolute -top-1 -right-1">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </div>
        <p className="text-2xl font-bold mb-1">1</p>
        <p className="text-sm text-gray-600">شهر مجاني لكل دعوة</p>
      </div>
    </div>
  );
}
