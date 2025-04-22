
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Investment platforms data
const INVESTMENT_PLATFORMS = [
  {
    id: "stake",
    name: "Stake",
    category: "عقارات",
    location: "دبي",
    description: "منصة للاستثمار العقاري الجزئي في دبي، تمكنك من الاستثمار بمبالغ صغيرة في عقارات فاخرة.",
    minInvestment: "500 دولار",
    expectedReturns: "8-12%",
    website: "https://stake.com",
    logo: "🏢"
  },
  {
    id: "aseel",
    name: "أصيل",
    category: "عقارات",
    location: "السعودية",
    description: "منصة استثمار عقاري سعودية تتيح للمستثمرين الاستثمار في مشاريع عقارية بالمملكة.",
    minInvestment: "1000 ريال",
    expectedReturns: "7-10%",
    website: "https://aseel.sa",
    logo: "🏙️"
  },
  {
    id: "abyan",
    name: "أبيان المالية",
    category: "أسهم",
    location: "السعودية",
    description: "منصة متخصصة في الاستثمار في سوق الأسهم السعودي بحد أدنى منخفض.",
    minInvestment: "500 ريال",
    expectedReturns: "متغير",
    website: "https://abyan.com",
    logo: "📈"
  },
  {
    id: "gosteward",
    name: "Go Steward",
    category: "زراعة",
    location: "عالمي",
    description: "منصة للاستثمار في المشاريع الزراعية المستدامة وتمويل المزارعين.",
    minInvestment: "100 دولار",
    expectedReturns: "4-7%",
    website: "https://gosteward.com",
    logo: "🌱"
  },
  {
    id: "gammaassets",
    name: "Gamma Assets",
    category: "عقارات",
    location: "عالمي",
    description: "منصة استثمار عقاري متنوعة بفرص في أسواق مختلفة.",
    minInvestment: "250 دولار",
    expectedReturns: "6-9%",
    website: "https://gammaassets.com",
    logo: "🏘️"
  },
  {
    id: "arrived",
    name: "Arrived",
    category: "عقارات",
    location: "أمريكا",
    description: "منصة للاستثمار في العقارات الأمريكية السكنية بمبالغ صغيرة.",
    minInvestment: "100 دولار",
    expectedReturns: "5-8%",
    website: "https://arrived.com",
    logo: "🏠"
  }
];

// Investment risk profiles
const INVESTMENT_PROFILES = [
  {
    id: "conservative",
    name: "المحافظ",
    description: "أمان أكبر مع عوائد أقل، مناسب للأشخاص الذين يتجنبون المخاطر",
    allocation: [
      { type: "أصول ثابتة (صكوك، سندات)", percentage: 60 },
      { type: "أسهم", percentage: 20 },
      { type: "عقارات", percentage: 15 },
      { type: "سيولة نقدية", percentage: 5 }
    ]
  },
  {
    id: "balanced",
    name: "المتوازن",
    description: "توازن بين المخاطر والعوائد المتوقعة، مناسب لمعظم المستثمرين",
    allocation: [
      { type: "أصول ثابتة (صكوك، سندات)", percentage: 40 },
      { type: "أسهم", percentage: 40 },
      { type: "عقارات", percentage: 15 },
      { type: "سيولة نقدية", percentage: 5 }
    ]
  },
  {
    id: "aggressive",
    name: "المغامر",
    description: "مخاطرة أعلى مع احتمالية عوائد أكبر، مناسب للمستثمرين الشباب",
    allocation: [
      { type: "أصول ثابتة (صكوك، سندات)", percentage: 20 },
      { type: "أسهم", percentage: 60 },
      { type: "عقارات", percentage: 15 },
      { type: "سيولة نقدية", percentage: 5 }
    ]
  }
];

export default function Investment() {
  const { toast } = useToast();
  const [selectedProfile, setSelectedProfile] = useState("balanced");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  
  const handleLearnMore = (platform: string) => {
    setSelectedPlatform(platform);
  };
  
  const filteredPlatforms = filter === "all" 
    ? INVESTMENT_PLATFORMS 
    : INVESTMENT_PLATFORMS.filter(platform => platform.category === filter);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="الاستثمار الذكي" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Risk Profile */}
        <section className="mb-8">
          <h2 className="text-xl font-bold font-cairo mb-4 text-right">نوع المستثمر</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INVESTMENT_PROFILES.map(profile => (
              <Card 
                key={profile.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedProfile === profile.id ? 'border-2 border-growup' : ''
                }`}
                onClick={() => setSelectedProfile(profile.id)}
              >
                <CardHeader>
                  <CardTitle className="text-right font-cairo flex justify-between items-center">
                    <div className={`w-4 h-4 rounded-full ${selectedProfile === profile.id ? 'bg-growup' : 'bg-gray-200'}`} />
                    {profile.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-500 font-cairo text-right mb-4">
                    {profile.description}
                  </p>
                  
                  <div className="space-y-2">
                    {profile.allocation.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="text-sm font-cairo">{item.percentage}%</div>
                        <div className="text-sm font-cairo">{item.type}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Investment Platforms */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-growup hover:bg-growup-dark" : ""}
              >
                الكل
              </Button>
              <Button 
                variant={filter === "عقارات" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("عقارات")}
                className={filter === "عقارات" ? "bg-growup hover:bg-growup-dark" : ""}
              >
                عقارات
              </Button>
              <Button 
                variant={filter === "أسهم" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("أسهم")}
                className={filter === "أسهم" ? "bg-growup hover:bg-growup-dark" : ""}
              >
                أسهم
              </Button>
              <Button 
                variant={filter === "زراعة" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilter("زراعة")}
                className={filter === "زراعة" ? "bg-growup hover:bg-growup-dark" : ""}
              >
                زراعة
              </Button>
            </div>
            
            <h2 className="text-xl font-bold font-cairo text-right">منصات الاستثمار</h2>
          </div>
          
          <div className="space-y-4">
            {filteredPlatforms.map(platform => (
              <Card key={platform.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-8 flex items-center justify-center bg-gray-50 text-5xl">
                    {platform.logo}
                  </div>
                  
                  <CardContent className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-x-2 rtl:space-x-reverse flex">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {platform.category}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {platform.location}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold font-cairo">{platform.name}</h3>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 font-cairo text-right">
                      {platform.description}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap justify-end gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500 font-cairo">العوائد المتوقعة: </span>
                        <span className="font-medium font-cairo">{platform.expectedReturns}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-gray-500 font-cairo">الحد الأدنى للاستثمار: </span>
                        <span className="font-medium font-cairo">{platform.minInvestment}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(platform.website, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        زيارة الموقع
                      </Button>
                      
                      <Button 
                        size="sm" 
                        onClick={() => handleLearnMore(platform.id)}
                        className="bg-growup hover:bg-growup-dark"
                      >
                        اعرف المزيد
                      </Button>
                    </div>
                  </CardContent>
                </div>
                
                {selectedPlatform === platform.id && (
                  <CardFooter className="bg-gray-50 p-6 block">
                    <h4 className="font-cairo font-bold text-lg mb-2 text-right">كيف تبدأ مع {platform.name}؟</h4>
                    
                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-cairo">قم بزيارة موقعهم الإلكتروني وإنشاء حساب</span>
                        <CircleCheck className="h-5 w-5 text-growup" />
                      </div>
                      
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-cairo">أكمل عملية التحقق من هويتك (KYC)</span>
                        <CircleCheck className="h-5 w-5 text-growup" />
                      </div>
                      
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-cairo">استكشف الفرص الاستثمارية المتاحة وابدأ بمبلغ صغير</span>
                        <CircleCheck className="h-5 w-5 text-growup" />
                      </div>
                      
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-cairo">تابع استثماراتك وأعد استثمار الأرباح</span>
                        <CircleCheck className="h-5 w-5 text-growup" />
                      </div>
                    </div>
                    
                    <Button 
                      className="mt-4 bg-growup hover:bg-growup-dark"
                      onClick={() => {
                        toast({
                          title: "تم إضافة المنصة إلى المفضلة",
                          description: `تم إضافة ${platform.name} إلى قائمة المنصات المفضلة`
                        });
                      }}
                    >
                      أضف إلى المفضلة
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </section>
        
        {/* Investment Tips */}
        <section className="mt-8">
          <Card className="bg-gradient-to-br from-growup/10 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-right">نصائح للمستثمر المبتدئ</h3>
              
              <div className="space-y-3">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo text-right">ابدأ بمبالغ صغيرة وزد مع اكتساب الخبرة.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo text-right">نوع استثماراتك ولا تضع كل أموالك في مكان واحد.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo text-right">خصص وقتاً للتعلم عن الاستثمار قبل البدء.</p>
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="font-cairo text-right">استثمر فقط ما تستطيع خسارته، ولا تستثمر بالدين.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
