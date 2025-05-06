
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="سياسة الخصوصية" />
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-growup/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-growup" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-6 text-center">سياسة الخصوصية</h1>
          <p className="text-gray-500 mb-4 text-center">آخر تحديث: 6 مايو 2025</p>
          
          <div className="space-y-6 text-right">
            <section>
              <h2 className="text-xl font-bold mb-3">مقدمة</h2>
              <p className="text-gray-700">
                نحن في تطبيق GrowUp نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. تصف سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات التي تقدمها عند استخدام تطبيقنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">المعلومات التي نجمعها</h2>
              <p className="text-gray-700 mb-2">
                نجمع المعلومات التالية عند استخدامك للتطبيق:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>المعلومات الشخصية (مثل الاسم والبريد الإلكتروني) التي تقدمها عند إنشاء الحساب</li>
                <li>معلومات المالية التي تدخلها في التطبيق لأغراض التخطيط والتتبع</li>
                <li>معلومات عن عاداتك وأهدافك الشخصية التي تضيفها للتطبيق</li>
                <li>معلومات تقنية عن جهازك وكيفية استخدامك للتطبيق</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">كيفية استخدام المعلومات</h2>
              <p className="text-gray-700 mb-2">
                نستخدم معلوماتك للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>توفير وتحسين خدمات التطبيق</li>
                <li>إنشاء تقارير وتحليلات مخصصة لك</li>
                <li>إرسال تنبيهات وإشعارات متعلقة بأهدافك والتزاماتك</li>
                <li>تحسين وتطوير ميزات جديدة للتطبيق</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">مشاركة المعلومات</h2>
              <p className="text-gray-700">
                نحن لا نبيع أو نؤجر أو نتاجر بمعلوماتك الشخصية مع أطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل التطبيق (مثل خدمات الاستضافة ومعالجة المدفوعات)</li>
                <li>عندما يكون ذلك مطلوبًا بموجب القانون أو لحماية حقوقنا</li>
                <li>في حالة الاندماج أو الاستحواذ، قد يتم نقل معلوماتك إلى الشركة الجديدة</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">أمان البيانات</h2>
              <p className="text-gray-700">
                نحن نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. نستخدم تقنيات التشفير وجدران الحماية وغيرها من الإجراءات الأمنية لحماية بياناتك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">حقوقك</h2>
              <p className="text-gray-700 mb-2">
                لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>حذف بياناتك (في ظروف معينة)</li>
                <li>تقييد معالجة بياناتك</li>
                <li>نقل بياناتك (في ظروف معينة)</li>
                <li>الاعتراض على المعالجة</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">التغييرات على سياسة الخصوصية</h2>
              <p className="text-gray-700">
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية من خلال نشر السياسة الجديدة على التطبيق وإخطارك عبر البريد الإلكتروني.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">اتصل بنا</h2>
              <p className="text-gray-700">
                إذا كانت لديك أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني:
                <span className="font-bold block mt-1">privacy@growup-app.com</span>
              </p>
            </section>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <Button 
            onClick={() => navigate(-1)} 
            className="bg-growup hover:bg-growup-dark"
          >
            العودة
          </Button>
        </div>
      </div>
    </div>
  );
}
