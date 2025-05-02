
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm = ({ onClose, onSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تمت عملية الدفع بنجاح!",
        description: "سيتم تفعيل اشتراكك فوراً",
      });
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-scale-in overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-right">إتمام عملية الدفع</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-semibold block text-right">الاسم الكامل على البطاقة</label>
              <Input 
                placeholder="أدخل الاسم الكامل" 
                name="cardName" 
                value={cardDetails.cardName}
                onChange={handleChange}
                className="bg-gray-100 text-right h-12" 
                dir="rtl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-semibold block text-right">رقم البطاقة</label>
              <Input 
                placeholder="0000 0000 0000 0000" 
                name="cardNumber" 
                value={cardDetails.cardNumber}
                onChange={handleChange}
                className="bg-gray-100 text-right h-12" 
                inputMode="numeric"
                dir="ltr"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-semibold block text-right">تاريخ الانتهاء / CVV</label>
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <Input 
                    placeholder="CVV" 
                    name="cvv" 
                    value={cardDetails.cvv}
                    onChange={handleChange}
                    className="bg-gray-100 h-12" 
                    inputMode="numeric"
                    dir="ltr"
                    required
                    maxLength={4}
                  />
                </div>
                <div className="col-span-3">
                  <Input 
                    placeholder="MM/YY" 
                    name="expiry" 
                    value={cardDetails.expiry}
                    onChange={handleChange}
                    className="bg-gray-100 h-12" 
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-growup hover:bg-growup-dark h-14 text-base sm:text-lg font-semibold rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري معالجة الطلب..." : "ادفع الآن"}
          </Button>
          
          <div className="relative flex items-center justify-center mt-2">
            <hr className="w-full border-t border-gray-300" />
            <span className="bg-white px-3 text-xs sm:text-sm text-gray-500 absolute">أو الدفع باستخدام</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              type="button" 
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex justify-center items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? 50 : 80} height={39} viewBox="0 0 80 39" fill="none">
                <g clipPath="url(#clip0_134_34)">
                  <path d="M25.9 17.7C25.9 16.8 25.8 15.9 25.7 15H13.2V20.1H20.3C20 21.7 19.1 23.2 17.7 24.1V27.4H22C24.5 25.1 25.9 21.7 25.9 17.7Z" fill="#4285F4" />
                  <path d="M13.1999 30.5999C16.7999 30.5999 19.7999 29.3999 21.9999 27.3999L17.6999 24.0999C16.4999 24.8999 14.9999 25.3999 13.1999 25.3999C9.7999 25.3999 6.7999 23.0999 5.7999 19.8999H1.3999V23.2999C3.6999 27.7999 8.1999 30.5999 13.1999 30.5999Z" fill="#34A853" />
                  <path d="M5.8001 19.8999C5.2001 18.2999 5.2001 16.4999 5.8001 14.7999V11.3999H1.4001C-0.499902 15.0999 -0.499902 19.4999 1.4001 23.2999L5.8001 19.8999Z" fill="#FBBC04" />
                  <path d="M13.2 9.39996C15.1 9.39996 16.9 10.1 18.3 11.4L22.1 7.59996C19.7 5.39996 16.5 4.09996 13.3 4.19996C8.3 4.19996 3.7 6.99996 1.5 11.5L5.9 14.9C6.8 11.7 9.8 9.39996 13.2 9.39996Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_134_34">
                    <rect width={80} height="38.1" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button 
              type="button" 
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex justify-center items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 210.2" xmlSpace="preserve" width={isMobile ? 50 : 70}>
                <path id="XMLID_34_" d="M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9  C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2  c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7  c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2  C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z   M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2  c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8  c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4  l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5  l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
