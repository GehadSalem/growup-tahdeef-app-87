
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function QuoteSection() {
  const navigate = useNavigate();
  
  return (
    <section className="section-card card-gradient">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg font-cairo font-bold mb-2">اقتباس اليوم</h3>
          <p className="text-xl font-cairo text-gray-700">
            "صغير الجهد اليوم، كبير الأثر بكرة."
          </p>
        </div>
        
        <div className="bg-growup/10 border border-growup/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <h4 className="font-bold font-cairo">ترقية لعضوية Premium</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3 text-right">
            احصل على جميع المميزات المتقدمة وحقق أهدافك بشكل أسرع
          </p>
          <Button
            className="w-full bg-gradient-to-r from-growup to-growup-dark hover:opacity-90 transition-opacity"
            size="sm"
            onClick={() => navigate('/subscription')}
          >
            اشترك الآن - $4/شهريًا فقط
          </Button>
        </div>
      </div>
    </section>
  );
}
