
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// تحديد ميزات الاشتراك في مصفوفة لسهولة التعديل
const SUBSCRIPTION_FEATURES = [
  "وصول كامل لجميع أدوات تطوير الذات",
  "تتبع مخصص للعادات السيئة والجيدة",
  "خطة مالية شاملة وتقارير شهرية",
  "تنبيهات وإشعارات ذكية للالتزامات",
  "نصائح مخصصة حسب أهدافك الشخصية",
  "أدوات متقدمة للتخطيط المالي وتحقيق الأهداف",
  "دعم فني مميز على مدار الساعة",
  "تحديثات مستمرة ومزايا حصرية"
];

// مكونات فرعية لتنظيم صفحة الاشتراك
const SubscriptionFeature = ({ feature }: { feature: string }) => (
  <div className="flex items-center justify-end gap-2">
    <span className="text-gray-700 text-right">{feature}</span>
    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
      <Check className="h-3 w-3 text-green-600" />
    </div>
  </div>
);

const BenefitCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <Card className="bg-white shadow-md border-0">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl font-bold text-right">{icon} {title}</CardTitle>
    </CardHeader>
    <CardContent className="text-right">
      <p>{description}</p>
    </CardContent>
  </Card>
);

const FAQ = ({ question, answer }: { question: string; answer: string }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="font-bold mb-2 text-right">{question}</h3>
    <p className="text-gray-700 text-right">{answer}</p>
  </div>
);

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    
    // محاكاة طلب الدفع
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "تم الاشتراك بنجاح!",
        description: "مرحبًا بك في عضوية GrowUp المميزة!",
      });
      navigate("/dashboard-app");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="اشترك الآن" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* عنوان الصفحة والوصف */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-cairo mb-4">استثمر في نفسك مع GrowUp Premium</h1>
            <p className="text-lg text-gray-600">
              اشترك الآن واحصل على جميع الأدوات التي تحتاجها لبناء مستقبل أفضل - بسعر كوب قهوة شهريًا!
            </p>
          </div>
          
          {/* بطاقة خطة الاشتراك */}
          <Card className="border-2 border-growup shadow-lg mb-8">
            <CardHeader className="bg-gradient-to-r from-growup/20 to-growup/5 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-right flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  عضوية GrowUp Premium
                </CardTitle>
                <div className="font-bold text-xl">
                  <span className="text-3xl">$4</span> 
                  <span className="text-gray-600 text-lg">/شهريًا</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6 text-right">
                كل ما تحتاجه لتحقيق النجاح في جوانب حياتك المختلفة - تطوير الذات، إدارة العادات، والتخطيط المالي الذكي.
              </p>
              
              <div className="space-y-3">
                {SUBSCRIPTION_FEATURES.map((feature, index) => (
                  <SubscriptionFeature key={index} feature={feature} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button 
                className={cn(
                  "w-full h-12 text-lg bg-growup hover:bg-growup-dark transition-all",
                  isLoading && "opacity-75"
                )} 
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? "جاري معالجة الطلب..." : "اشترك الآن - $4 شهريًا"}
              </Button>
              <p className="text-xs text-center text-gray-500">
                يمكنك إلغاء الاشتراك في أي وقت. نضمن لك استرداد كامل المبلغ خلال 14 يومًا إذا لم تكن راضيًا عن الخدمة.
              </p>
            </CardFooter>
          </Card>

          {/* مميزات الاشتراك - عرض مرئي */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-cairo mb-6 text-right">لماذا تشترك في GrowUp Premium؟</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenefitCard 
                icon="🧠"
                title="تطوير ذاتي شامل"
                description="أدوات متكاملة لتطوير عاداتك الإيجابية وكسر العادات السلبية. مع تحليلات مخصصة ونصائح تناسب أسلوب حياتك."
              />
              
              <BenefitCard 
                icon="💰"
                title="إدارة مالية ذكية"
                description="تخطيط مالي متقدم مع تتبع للنفقات وتذكير بالالتزامات الشهرية. مع تقارير مفصلة ونصائح لزيادة المدخرات."
              />
              
              <BenefitCard 
                icon="🎯"
                title="تحقيق الأهداف"
                description="خطط مخصصة لتحقيق أهدافك المالية والشخصية والمهنية. مع تتبع مستمر للتقدم وتحفيز يومي للاستمرار."
              />
              
              <BenefitCard 
                icon="🛠️"
                title="أدوات متقدمة"
                description="حاسبات مالية، تقارير مخصصة، ورسوم بيانية تفاعلية. مع واجهة سهلة الاستخدام لتبسيط رحلة نموك الشخصي."
              />
            </div>
          </div>

          {/* أسئلة متكررة */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-cairo mb-6 text-right">أسئلة متكررة</h2>
            
            <div className="space-y-4">
              <FAQ 
                question="هل يمكنني إلغاء الاشتراك في أي وقت؟"
                answer="نعم، يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية."
              />
              
              <FAQ 
                question="هل هناك فترة تجريبية مجانية؟"
                answer="نعم، نقدم ضمان استرداد كامل المبلغ خلال 14 يومًا إذا لم تكن راضيًا عن الخدمة."
              />
              
              <FAQ 
                question="ما هي طرق الدفع المتاحة؟"
                answer="نقبل بطاقات الائتمان (Visa، MasterCard، American Express) وكذلك Apple Pay وGoogle Pay."
              />
            </div>
          </div>
          
          {/* زر الاشتراك النهائي */}
          <div className="text-center mb-4">
            <Button
              className="bg-growup hover:bg-growup-dark text-white px-8 py-6 rounded-xl text-xl"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              ابدأ رحلة تطورك الآن - اشترك مقابل $4 فقط شهريًا
            </Button>
          </div>
          <p className="text-center text-gray-600 text-sm">
            بالاشتراك، أنت توافق على <a href="#" className="text-growup hover:underline">شروط الاستخدام</a> و<a href="#" className="text-growup hover:underline">سياسة الخصوصية</a>
          </p>
        </div>
      </div>
    </div>
  );
}
