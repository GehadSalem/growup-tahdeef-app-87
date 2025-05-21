import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Camera, Edit, Gift, Link, LogOut, Mail, Phone, Settings, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ProfileData } from "@/lib/types";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "user-123",
    name: "أحمد محمد",
    email: "ahmad@example.com",
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEditProfile = () => {
    toast.info("سيتم إضافة إمكانية تعديل الملف الشخصي قريباً");
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleChangePhoto = () => {
    toast.info("سيتم إضافة إمكانية تغيير الصورة الشخصية قريباً");
  };

  const handleManageSubscription = () => {
    navigate("/subscription");
  };
  
  const handleNavigateToReferral = () => {
    navigate("/referral");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="الملف الشخصي" showBackButton />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* بطاقة الملف الشخصي */}
          <Card className="mb-6 border-0 shadow-md">
            <CardHeader className="relative pb-24 bg-gradient-to-r from-growup/30 to-growup/5">
              <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2 flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="bg-growup text-xl text-white">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 rounded-full bg-white w-8 h-8"
                    onClick={handleChangePhoto}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-16 text-center">
              <h2 className="text-2xl font-bold mb-1">{profileData.name}</h2>
              <p className="text-gray-600 mb-2">{profileData.email}</p>

              <div className="flex justify-center gap-3 mb-5">
                {profileData.subscription.isSubscribed && (
                  <Badge className="bg-growup hover:bg-growup">مشترك Premium</Badge>
                )}
                <Badge variant="outline" className="border-gray-300">
                  عضو منذ {formatDate(profileData.joinDate)}
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                  onClick={handleEditProfile}
                >
                  <Edit className="h-4 w-4" />
                  <span>تعديل الملف</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
              
              {/* بطاقة الإحالة المميزة */}
              <div className="bg-growup/10 rounded-lg p-4 mb-4 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Gift className="h-12 w-12 text-growup opacity-20" />
                </div>
                <h3 className="text-lg font-bold mb-2">نظام الإحالة</h3>
                <p className="text-sm mb-3">
                  ادعُ أصدقاءك واحصل على شهر مجاني من اشتراك Premium!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNavigateToReferral}
                    className="flex items-center gap-1"
                  >
                    <Link className="h-4 w-4" />
                    <span>رابط الإحالة</span>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleNavigateToReferral} 
                    className="flex items-center gap-1 bg-growup hover:bg-growup/90"
                  >
                    <Share className="h-4 w-4" />
                    <span>دعوة الأصدقاء</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* بيانات المستخدم والاشتراك */}
          <Tabs defaultValue="personal" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">بياناتي</TabsTrigger>
              <TabsTrigger value="subscription">الاشتراك</TabsTrigger>
              <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            </TabsList>

            {/* بيانات المستخدم */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">البيانات الشخصية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>البريد الإلكتروني</span>
                    </div>
                    <div>{profileData.email}</div>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
                      </svg>
                      <span>الدولة</span>
                    </div>
                    <div>{profileData.country || "غير محدد"}</div>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
                      </svg>
                      <span>المدينة</span>
                    </div>
                    <div>{profileData.city || "غير محدد"}</div>
                  </div>

                  <div className="flex justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>تاريخ الانضمام</span>
                    </div>
                    <div>{formatDate(profileData.joinDate)}</div>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Gift className="h-4 w-4" />
                      <span>رمز الإحالة</span>
                    </div>
                    <div className="font-mono">{profileData.referralCode}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleEditProfile}
                  >
                    تعديل البيانات الشخصية
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* بيانات الاشتراك */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">بيانات الاشتراك</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <div className="text-gray-600">حالة الاشتراك</div>
                    <div>
                      {profileData.subscription.isSubscribed ? (
                        <Badge className="bg-green-500 hover:bg-green-500">نشط</Badge>
                      ) : (
                        <Badge variant="secondary">غير مشترك</Badge>
                      )}
                    </div>
                  </div>

                  {profileData.subscription.isSubscribed && (
                    <>
                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">نوع الباقة</div>
                        <div>{profileData.subscription.plan}</div>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">تاريخ بدء الاشتراك</div>
                        <div>{formatDate(profileData.subscription.startDate || "")}</div>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">تاريخ نهاية الاشتراك</div>
                        <div>{formatDate(profileData.subscription.endDate || "")}</div>
                      </div>

                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">التجديد التلقائي</div>
                        <div>
                          {profileData.subscription.autoRenew ? (
                            <Badge className="bg-blue-500 hover:bg-blue-500">مفعل</Badge>
                          ) : (
                            <Badge variant="secondary">غير مفعل</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">شهور مجانية من الإحالات</div>
                        <div>{profileData.freeMonthsEarned || 0} شهر</div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={profileData.subscription.isSubscribed ? "outline" : "default"}
                    onClick={handleManageSubscription}
                  >
                    {profileData.subscription.isSubscribed
                      ? "إدارة الاشتراك"
                      : "الاشتراك الآن"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* إحصائيات المستخدم */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إحصائياتي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-growup/10 rounded-lg">
                      <p className="text-2xl font-bold mb-1">
                        {profileData.stats.completedGoals}
                      </p>
                      <p className="text-sm text-gray-600">الأهداف المكتملة</p>
                    </div>

                    <div className="text-center p-3 bg-growup/10 rounded-lg">
                      <p className="text-2xl font-bold mb-1">
                        {profileData.stats.activeDays}
                      </p>
                      <p className="text-sm text-gray-600">أيام النشاط</p>
                    </div>

                    <div className="text-center p-3 bg-growup/10 rounded-lg">
                      <p className="text-2xl font-bold mb-1">
                        {profileData.stats.financialHealthScore}%
                      </p>
                      <p className="text-sm text-gray-600">مؤشر الصحة المالية</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-gray-500 text-sm">
            <p>
              واجهت مشكلة؟{" "}
              <button className="text-growup hover:underline">تواصل مع الدعم</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
