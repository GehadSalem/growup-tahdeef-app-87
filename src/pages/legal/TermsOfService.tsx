
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="شروط الاستخدام" />
      
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-growup/10 flex items-center justify-center">
              <FileText className="h-10 w-10 text-growup" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-6 text-center">شروط الاستخدام</h1>
          <p className="text-gray-500 mb-4 text-center">آخر تحديث: 6 مايو 2025</p>
          
          <div className="space-y-6 text-right">
            <section>
              <h2 className="text-xl font-bold mb-3">مقدمة</h2>
              <p className="text-gray-700">
                مرحبًا بك في تطبيق GrowUp. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية قبل استخدام التطبيق.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">استخدام التطبيق</h2>
              <p className="text-gray-700 mb-2">
                عند استخدام تطبيق GrowUp، أنت توافق على:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>توفير معلومات دقيقة وكاملة عند إنشاء حسابك</li>
                <li>الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك</li>
                <li>استخدام التطبيق بطريقة قانونية وأخلاقية</li>
                <li>عدم استخدام التطبيق لأي غرض غير مصرح به أو غير قانوني</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">الحسابات والتسجيل</h2>
              <p className="text-gray-700">
                لاستخدام بعض ميزات التطبيق، قد تحتاج إلى إنشاء حساب. أنت مسؤول عن الحفاظ على أمان حسابك وكلمة المرور الخاصة بك. يجب إخطارنا فورًا بأي استخدام غير مصرح به لحسابك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">الاشتراكات والمدفوعات</h2>
              <p className="text-gray-700 mb-2">
                يقدم التطبيق خطط اشتراك مدفوعة للوصول إلى ميزات متقدمة:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>تتم معالجة المدفوعات من خلال مزودي خدمة دفع خارجيين</li>
                <li>يتم تجديد الاشتراكات تلقائيًا ما لم يتم إلغاؤها قبل تاريخ التجديد</li>
                <li>يمكن إلغاء الاشتراك في أي وقت من خلال إعدادات حسابك</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">حقوق الملكية الفكرية</h2>
              <p className="text-gray-700">
                التطبيق وجميع محتوياته، بما في ذلك النصوص والصور والرسومات والواجهة والشعارات، هي مملوكة لنا أو مرخصة لنا. لا يُسمح بنسخ أو إعادة إنتاج أو تعديل أو توزيع أي جزء من التطبيق دون إذن كتابي منا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">إخلاء المسؤولية</h2>
              <p className="text-gray-700">
                يتم توفير التطبيق "كما هو" دون أي ضمانات. نحن لا نضمن أن التطبيق سيكون خاليًا من الأخطاء أو متاحًا بشكل مستمر. النصائح والمعلومات المقدمة في التطبيق هي لأغراض إرشادية عامة فقط ولا ينبغي اعتبارها نصائح مالية أو قانونية محترفة.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">تحديد المسؤولية</h2>
              <p className="text-gray-700">
                لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية تنشأ عن استخدامك للتطبيق، بما في ذلك على سبيل المثال لا الحصر، فقدان البيانات أو الأرباح.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">التعديلات على الشروط</h2>
              <p className="text-gray-700">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر الشروط المعدلة على التطبيق. استمرارك في استخدام التطبيق بعد نشر أي تغييرات يعني موافقتك على الشروط المعدلة.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">القانون الحاكم</h2>
              <p className="text-gray-700">
                تخضع هذه الشروط للقوانين المعمول بها، وأي نزاع ينشأ عن استخدام التطبيق سيخضع للاختصاص الحصري للمحاكم المختصة.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">اتصل بنا</h2>
              <p className="text-gray-700">
                إذا كانت لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا على:
                <span className="font-bold block mt-1">terms@growup-app.com</span>
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
