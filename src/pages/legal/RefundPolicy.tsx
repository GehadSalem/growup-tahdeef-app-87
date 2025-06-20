
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { ReceiptText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RefundPolicy() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="سياسة استرداد الأموال" onBackClick={() => navigate('/main-menu')} />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-growup/10 flex items-center justify-center">
              <ReceiptText className="h-10 w-10 text-growup" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-6 text-center">سياسة استرداد الأموال</h1>
          <p className="text-gray-500 mb-4 text-center">آخر تحديث: 6 مايو 2025</p>
          
          <div className="space-y-6 text-right">
            <section>
              <h2 className="text-xl font-bold mb-3">مقدمة</h2>
              <p className="text-gray-700">
                في تطبيق GrowUp، نسعى دائمًا لضمان رضا المستخدمين عن خدماتنا. تصف هذه السياسة إجراءات استرداد الأموال الخاصة بنا للاشتراكات المدفوعة.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">فترة ضمان استرداد الأموال</h2>
              <p className="text-gray-700">
                نقدم ضمان استرداد كامل المبلغ خلال 14 يومًا من تاريخ الاشتراك الأولي. إذا لم تكن راضيًا عن خدماتنا لأي سبب خلال هذه الفترة، يمكنك طلب استرداد كامل المبلغ دون الحاجة إلى تقديم تفسير.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">كيفية طلب استرداد الأموال</h2>
              <p className="text-gray-700 mb-2">
                لطلب استرداد الأموال، يمكنك:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>إرسال طلب عبر قسم "الدعم" في التطبيق</li>
                <li>إرسال بريد إلكتروني إلى refunds@growup-app.com</li>
                <li>الاتصال بخدمة العملاء على الرقم المذكور في التطبيق</li>
              </ul>
              <p className="text-gray-700 mt-2">
                يرجى تضمين تفاصيل حسابك وتاريخ الاشتراك في طلبك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">معالجة طلبات الاسترداد</h2>
              <p className="text-gray-700">
                سنقوم بمراجعة طلب الاسترداد الخاص بك في غضون 2-3 أيام عمل. بمجرد الموافقة، سيتم رد المبلغ إلى طريقة الدفع الأصلية التي استخدمتها للاشتراك. قد يستغرق ظهور المبلغ في حسابك ما بين 5-10 أيام عمل حسب سياسات البنك أو مزود خدمة الدفع الخاص بك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">استثناءات</h2>
              <p className="text-gray-700 mb-2">
                قد لا تكون بعض الحالات مؤهلة للاسترداد الكامل بعد فترة الضمان البالغة 14 يومًا:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mr-4">
                <li>الاشتراكات التي مضى عليها أكثر من 14 يومًا</li>
                <li>الاشتراكات التي استفادت من خصومات خاصة أو عروض ترويجية</li>
                <li>الحسابات التي أساءت استخدام سياسة الاسترداد سابقًا</li>
              </ul>
              <p className="text-gray-700 mt-2">
                ومع ذلك، سننظر في كل حالة على حدة، وقد نقدم استردادًا جزئيًا أو كاملًا بناءً على الظروف.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">إلغاء الاشتراك</h2>
              <p className="text-gray-700">
                يمكنك إلغاء اشتراكك في أي وقت من خلال إعدادات حسابك في التطبيق. عند إلغاء الاشتراك، ستستمر في الوصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية. لن يتم تحصيل أي رسوم إضافية بعد ذلك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">تغييرات على سياسة الاسترداد</h2>
              <p className="text-gray-700">
                نحتفظ بالحق في تعديل سياسة الاسترداد هذه في أي وقت. ستكون التغييرات سارية المفعول فور نشرها على التطبيق. لن تؤثر أي تغييرات على طلبات الاسترداد المقدمة قبل تاريخ التغيير.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-3">اتصل بنا</h2>
              <p className="text-gray-700">
                إذا كان لديك أي أسئلة أو استفسارات حول سياسة الاسترداد الخاصة بنا، يرجى التواصل معنا على:
                <span className="font-bold block mt-1">refunds@growup-app.com</span>
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
