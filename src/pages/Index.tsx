
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد أكمل الاستبيان من قبل
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (onboardingCompleted === 'true') {
      // إذا كان قد أكمل الاستبيان، توجيهه إلى صفحة تسجيل الدخول
      navigate('/login');
    } else {
      // في حالة أول زيارة، توجيه المستخدم إلى صفحة الاستبيان
      navigate('/onboarding');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default Index;
