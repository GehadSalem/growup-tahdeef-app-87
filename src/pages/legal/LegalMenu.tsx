
import { AppHeader } from "@/components/ui/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ReceiptText, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LegalMenu() {
  const navigate = useNavigate();
  
  const legalDocs = [
    {
      title: "سياسة الخصوصية",
      description: "كيف نحمي بياناتك ومعلوماتك الشخصية",
      icon: <Shield className="h-6 w-6 text-growup" />,
      route: "/privacy-policy"
    },
    {
      title: "شروط الاستخدام",
      description: "الشروط والأحكام التي تحكم استخدامك للتطبيق",
      icon: <FileText className="h-6 w-6 text-growup" />,
      route: "/terms-of-service"
    },
    {
      title: "سياسة استرداد الأموال",
      description: "معلومات حول كيفية طلب استرداد الأموال وسياستنا",
      icon: <ReceiptText className="h-6 w-6 text-growup" />,
      route: "/refund-policy"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showMenu title="المستندات القانونية" onMenuClick={() => navigate('/main-menu')} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">المستندات القانونية</h1>
            <p className="text-gray-600">جميع سياسات وشروط استخدام تطبيق GrowUp</p>
          </div>
          
          <div className="space-y-4">
            {legalDocs.map((doc, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(doc.route)}
              >
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-growup/10 flex items-center justify-center ml-4">
                    {doc.icon}
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold">{doc.title}</h3>
                    <p className="text-gray-600 text-sm">{doc.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
