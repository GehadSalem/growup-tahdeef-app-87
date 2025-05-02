
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, CreditCard } from "lucide-react";
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
            <div className="flex justify-center mb-2">
              <CreditCard className="h-12 w-12 text-growup" />
            </div>
            
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
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
