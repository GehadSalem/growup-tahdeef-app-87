
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share } from "lucide-react";
import { toast } from "sonner";
import { ProfileData } from "@/lib/types";

interface ReferralCodeSectionProps {
  referralData: ProfileData;
  referralLink: string;
  copyReferralLink: () => void;
  shareReferralLink: () => void;
}

export function ReferralCodeSection({ 
  referralData, 
  referralLink, 
  copyReferralLink, 
  shareReferralLink 
}: ReferralCodeSectionProps) {
  return (
    <div className="grid gap-6">
      {/* رمز الإحالة */}
      <div className="bg-growup/5 rounded-lg p-4">
        <p className="text-gray-600 mb-2 text-center">رمز الإحالة الخاص بك</p>
        <div className="bg-white border border-gray-200 rounded-lg py-3 px-4 font-bold text-center text-lg tracking-widest">
          {referralData.referralCode}
        </div>
      </div>
      
      {/* رابط الإحالة */}
      <div>
        <label htmlFor="referral-link" className="block mb-2 text-gray-700">
          رابط الإحالة الخاص بك
        </label>
        <div className="flex gap-2">
          <Input
            id="referral-link"
            value={referralLink}
            readOnly
            className="bg-gray-50 text-sm"
            dir="ltr"
          />
          <Button
            variant="outline"
            onClick={copyReferralLink}
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4 ml-1" />
            نسخ
          </Button>
        </div>
      </div>
      
      {/* زر مشاركة الرابط */}
      <Button
        className="w-full bg-growup hover:bg-growup/90"
        onClick={shareReferralLink}
      >
        <Share className="h-5 w-5 ml-2" />
        مشاركة رابط الدعوة
      </Button>
    </div>
  );
}
