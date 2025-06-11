import { useState, useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Camera, Gift, Link, LogOut, Mail, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ProfileData } from "@/lib/types";
import { apiClient } from "@/lib/api.ts";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // جلب بيانات البروفيل
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // جلب البيانات المحفوظة محلياً
        const savedUserData = localStorage.getItem('user');
        if (savedUserData) {
          setProfileData(JSON.parse(savedUserData));
        }

        // جلب البيانات المحدثة من الخادم
        const data = await apiClient.get<ProfileData>("/profile");
        
        // إذا كان هناك صورة محفوظة محلياً ولم يتم تحديثها من الخادم
        if (profileData?.avatarUrl && !data.avatarUrl) {
          data.avatarUrl = profileData.avatarUrl;
        }
        
        setProfileData(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        setError("فشل في تحميل بيانات الملف الشخصي");
        console.error("Error fetching profile data:", err);
        
        // إذا فشل الاتصال بالخادم، نستخدم البيانات المحفوظة محلياً
        const savedUserData = localStorage.getItem('user');
        if (savedUserData) {
          setProfileData(JSON.parse(savedUserData));
          setError("تعذر الاتصال بالخادم، يتم عرض البيانات المحفوظة محلياً");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // معالجة اختيار صورة جديدة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // عرض معاينة الصورة
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // رفع الصورة الجديدة
  const uploadImage = async () => {
    if (!selectedImage) return;
    
    try {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      
      const response = await apiClient.patch<{ avatarUrl: string }>("/profile/avatar", formData);
      
      // تحديث حالة البروفيل
      const updatedProfile = {
        ...profileData,
        avatarUrl: response.avatarUrl
      };
      
      setProfileData(updatedProfile as ProfileData);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setShowImageUpload(false);
      setSelectedImage(null);
      setImagePreview(null);
      
      toast.success("تم تحديث الصورة الشخصية بنجاح");
    } catch (err) {
      toast.error("فشل في تحديث الصورة الشخصية");
      console.error("Error uploading image:", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };

  const handleManageSubscription = () => {
    navigate("/subscription");
  };
  
  const handleNavigateToReferral = () => {
    navigate("/referral");
  };
  
  const handleNavigateToContact = () => {
    navigate("/contact");
  };

  const copyReferralCode = () => {
    if (profileData?.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      toast.success("تم نسخ رمز الإحالة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="الملف الشخصي" showBackButton />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-growup"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="الملف الشخصي" showBackButton />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6 text-center">
                <p className="text-red-500 mb-4">{error || "فشل في تحميل بيانات الملف الشخصي"}</p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  إعادة المحاولة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="الملف الشخصي" showBackButton />

      <div className="container mx-auto pr-4 py-6">
        <div className="max-w-xs mx-auto">
          {/* بطاقة الملف الشخصي */}
          <Card className="mb-6 border-0 shadow-md">
            <CardHeader className="relative pb-24 bg-gradient-to-r from-growup/30 to-growup/5">
              <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2 flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} />
                    ) : (
                      <>
                        <AvatarImage src={profileData.avatarUrl} />
                        <AvatarFallback className="bg-growup text-xl text-white">
                          {getInitials(profileData.name)}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 rounded-full bg-white w-8 h-8"
                    onClick={() => setShowImageUpload(true)}
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
                {profileData.subscription?.isSubscribed && (
                  <Badge className="bg-growup hover:bg-growup">مشترك Premium</Badge>
                )}
                <Badge variant="outline" className="border-gray-300">
                  عضو منذ {formatDate(profileData.joinDate)}
                </Badge>
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
                    onClick={copyReferralCode}
                    className="flex items-center gap-1"
                  >
                    <Link className="h-4 w-4" />
                    <span>نسخ رمز الإحالة</span>
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
                    <div className="font-mono">{profileData.referralCode || "غير متاح"}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 ml-2" />
                    تسجيل الخروج
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
                      {profileData.subscription?.isSubscribed ? (
                        <Badge className="bg-green-500 hover:bg-green-500">نشط</Badge>
                      ) : (
                        <Badge variant="secondary">غير مشترك</Badge>
                      )}
                    </div>
                  </div>

                  {profileData.subscription?.isSubscribed && (
                    <>
                      <div className="flex justify-between py-2 border-b">
                        <div className="text-gray-600">نوع الباقة</div>
                        <div>{profileData.subscription.plan || "غير محدد"}</div>
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
                    variant={profileData.subscription?.isSubscribed ? "outline" : "default"}
                    onClick={handleManageSubscription}
                  >
                    {profileData.subscription?.isSubscribed
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
                        {profileData.stats?.completedGoals || 0}
                      </p>
                      <p className="text-sm text-gray-600">الأهداف المكتملة</p>
                    </div>

                    <div className="text-center p-3 bg-growup/10 rounded-lg">
                      <p className="text-2xl font-bold mb-1">
                        {profileData.stats?.activeDays || 0}
                      </p>
                      <p className="text-sm text-gray-600">أيام النشاط</p>
                    </div>

                    <div className="text-center p-3 bg-growup/10 rounded-lg">
                      <p className="text-2xl font-bold mb-1">
                        {profileData.stats?.financialHealthScore || 0}%
                      </p>
                      <p className="text-sm text-gray-600">مؤشر الصحة المالية</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 ml-2" />
                    تسجيل الخروج
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-gray-500 text-sm">
            <p>
              واجهت مشكلة؟{" "}
              <button className="text-growup hover:underline" onClick={handleNavigateToContact}>
                تواصل مع الدعم
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* مربع حوار تأكيد تسجيل الخروج */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center mb-2">تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-4 space-x-0 gap-2">
            <AlertDialogCancel className="sm:w-auto w-full">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white sm:w-auto w-full"
              onClick={confirmLogout}
            >
              <LogOut className="h-5 w-5 ml-2" />
              نعم، تسجيل الخروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* مربع حوار تغيير الصورة */}
      <AlertDialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center mb-2">تغيير الصورة الشخصية</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} />
                ) : (
                  <>
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="bg-growup text-xl text-white">
                      {getInitials(profileData.name)}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </div>
            
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
              <span>اختر صورة</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            
            {selectedImage && (
              <p className="text-sm text-gray-600">
                {selectedImage.name} ({(selectedImage.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <AlertDialogFooter className="sm:space-x-4 space-x-0 gap-2">
            <AlertDialogCancel 
              className="sm:w-auto w-full"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-growup hover:bg-growup/90 text-white sm:w-auto w-full"
              onClick={uploadImage}
              disabled={!selectedImage}
            >
              حفظ الصورة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;