
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Share, Gift, Award, Star } from "lucide-react";
import { ProfileData } from "@/lib/types";

const Referral = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "user-123",
    name: "أحمد محمد",
    email: "ahmad@example.com",
    phone: "+966 50 123 4567",
    country: "المملكة العربية السعودية",
    city: "الرياض",
    joinDate: "2023-01-15",
    subscription: {
      isSubscribed: true,
      plan: "GrowUp Premium",
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      autoRenew: true,
    },
    stats: {
      completedGoals: 12,
      activeDays: 45,
      financialHealthScore: 85,
    },
    referralCode: "AHMAD2023",
    referralCount: 3,
    freeMonthsEarned: 2,
  });
  
  const [referralLink, setReferralLink] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // إنشاء رابط الإحالة عند تحميل الصفحة
  useEffect(() => {
    const baseUrl = window.location.origin;
    setReferralLink(`${baseUrl}/signup?ref=${profileData.referralCode}`);
  }, [profileData.referralCode]);
  
  // نسخ رابط الإحالة إلى الحافظة
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("تم نسخ رابط الإحالة بنجاح");
  };
  
  // إرسال دعوة عبر البريد الإلكتروني
  const sendEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    setIsLoading(true);
    
    // محاكاة إرسال الدعوة عبر البريد الإلكتروني
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`تم إرسال الدعوة إلى ${emailInput} بنجاح`);
      setEmailInput("");
    }, 1500);
  };
  
  // مشاركة رابط الإحالة
  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "انضم إلى تطبيق GrowUp",
        text: `انضم إلي في تطبيق GrowUp مع شهر مجاني عند التسجيل! استخدم رمز الإحالة: ${profileData.referralCode}`,
        url: referralLink,
      }).catch(() => {
        toast.error("حدث خطأ أثناء مشاركة الرابط");
      });
    } else {
      copyReferralLink();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="نظام الإحالة" showBackButton />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* بطاقة مقدمة الإحالة */}
          <Card className="mb-6 shadow-md border-0 overflow-hidden">
            <div className="bg-gradient-to-l from-growup/30 to-growup/5 p-6 relative">
              <div className="absolute top-4 right-4">
                <Gift className="h-12 w-12 text-growup opacity-30" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">نظام الإحالة</CardTitle>
              <CardDescription className="text-lg">
                ادع أصدقاءك واحصل على شهر مجاني من اشتراك GrowUp Premium لكل صديق ينضم!
              </CardDescription>
            </div>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                {/* إحصائيات الإحالة */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-growup/10 rounded-lg">
                    <p className="text-2xl font-bold mb-1">{profileData.referralCount || 0}</p>
                    <p className="text-sm text-gray-600">الدعوات المقبولة</p>
                  </div>
                  
                  <div className="p-3 bg-growup/10 rounded-lg">
                    <p className="text-2xl font-bold mb-1">{profileData.freeMonthsEarned || 0}</p>
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
                
                {/* رمز الإحالة */}
                <div className="bg-growup/5 rounded-lg p-4">
                  <p className="text-gray-600 mb-2 text-center">رمز الإحالة الخاص بك</p>
                  <div className="bg-white border border-gray-200 rounded-lg py-3 px-4 font-bold text-center text-lg tracking-widest">
                    {profileData.referralCode}
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
                
                {/* أو خط فاصل */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500">أو</span>
                  </div>
                </div>
                
                {/* نموذج دعوة عبر البريد الإلكتروني */}
                <form onSubmit={sendEmailInvite}>
                  <p className="mb-2 text-gray-700">دعوة صديق عبر البريد الإلكتروني</p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="البريد الإلكتروني للصديق"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      className="flex-shrink-0"
                      disabled={isLoading}
                    >
                      {isLoading ? "جاري الإرسال..." : "دعوة"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
          
          {/* بطاقة كيفية عمل برنامج الإحالة */}
          <Card className="mb-6 border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="h-5 w-5 text-growup" />
                كيف يعمل برنامج الإحالة؟
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base">شارك رابط أو رمز الإحالة الخاص بك</h3>
                  <p className="text-sm text-gray-600">
                    أرسل الرابط لأصدقائك عبر الرسائل، وسائل التواصل الاجتماعي، أو البريد الإلكتروني.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-base">قم بدعوة أصدقائك للتسجيل</h3>
                  <p className="text-sm text-gray-600">
                    عندما ينقر صديقك على الرابط، سيتم توجيهه إلى صفحة التسجيل مع تطبيق رمز الإحالة الخاص بك تلقائيًا.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 bg-growup/10 h-8 w-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-base">احصل على المكافآت</h3>
                  <p className="text-sm text-gray-600">
                    بمجرد اشتراك صديقك، ستحصل على شهر مجاني من اشتراك Premium! وسيحصل صديقك أيضًا على شهر مجاني للبدء.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* الأسئلة الشائعة */}
          <Card className="mb-4 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">كم عدد الأصدقاء الذين يمكنني دعوتهم؟</h3>
                <p className="text-sm text-gray-600">
                  يمكنك دعوة عدد غير محدود من الأصدقاء! كلما زاد عدد الأشخاص الذين يقبلون دعوتك، زادت الشهور المجانية التي تحصل عليها.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-1">متى سأحصل على الشهر المجاني؟</h3>
                <p className="text-sm text-gray-600">
                  سيتم إضافة الشهر المجاني إلى حسابك بمجرد اشتراك صديقك في خطة مدفوعة بعد انتهاء الفترة التجريبية.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-1">هل يمكنني استخدام الشهور المجانية المتراكمة دفعة واحدة؟</h3>
                <p className="text-sm text-gray-600">
                  نعم! سيتم إضافة جميع الشهور المجانية التي تكسبها إلى نهاية فترة اشتراكك الحالية تلقائيًا.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50">
              <p className="text-sm text-gray-600 w-full text-center">
                لمزيد من الأسئلة، يرجى التواصل مع
                <a href="#" className="text-growup hover:underline mr-1">الدعم الفني</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Referral;
