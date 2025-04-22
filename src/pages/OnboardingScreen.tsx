
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ArrowLeft } from 'lucide-react';

// Define the interests data
const INTERESTS = [
  { id: 'self', emoji: '🧠', label: 'تطوير ذاتي' },
  { id: 'financial', emoji: '💰', label: 'مالي' },
  { id: 'health', emoji: '🧘‍♂️', label: 'صحي' },
  { id: 'social', emoji: '👥', label: 'اجتماعي' },
  { id: 'mental', emoji: '💭', label: 'نفسي' },
];

// Define the occupations data
const OCCUPATIONS = [
  { id: 'marketing', label: 'التسويق' },
  { id: 'management', label: 'إدارة الأعمال' },
  { id: 'design', label: 'التصميم' },
  { id: 'video', label: 'صانع فيديوهات' },
  { id: 'education', label: 'التعليم' },
  { id: 'other', label: 'أخرى' },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedOccupation, setSelectedOccupation] = useState<string>('');

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(item => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Save user preferences and navigate to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-growup-light">
      {/* Welcome Screen */}
      {step === 1 && (
        <div className="flex flex-1 flex-col items-center justify-between p-8 text-center">
          <div className="w-full pt-10">
            <Logo size="lg" className="mx-auto" />
          </div>
          
          <div className="space-y-6 max-w-md">
            <h1 className="text-3xl font-cairo font-bold text-gray-800">
              مرحباً بك في نسخة جديدة لنسخة أفضل، أفضل من نفسك.
            </h1>
            <p className="text-xl text-gray-700">
              جاهز تتبنى عادات أقوى، وتحقق أهدافك؟ خلنا نبدأ.
            </p>
          </div>
          
          <div className="w-full space-y-4">
            <Button 
              onClick={handleNext}
              className="w-full max-w-xs mx-auto btn-primary h-[52px] text-lg"
            >
              لنبدأ
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            
            <p className="text-growup-text text-center font-cairo">
              كل يوم هو فرصة جديدة .. لا تضيّعها.
            </p>
          </div>
        </div>
      )}

      {/* Interest Selection */}
      {step === 2 && (
        <div className="flex flex-1 flex-col p-8">
          <Logo className="mb-8" />
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-cairo mb-2">وش أكثر مجال يهمك؟</h1>
            <p className="text-growup-text">اختر المجالات التي تود التركيز عليها</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {INTERESTS.map((interest) => (
              <CategoryCard 
                key={interest.id}
                icon={<span className="text-3xl">{interest.emoji}</span>}
                label={interest.label}
                isActive={selectedInterests.includes(interest.id)}
                onClick={() => toggleInterest(interest.id)}
              />
            ))}
          </div>
          
          <div className="mt-auto">
            <Button 
              onClick={handleNext}
              disabled={selectedInterests.length === 0}
              className="w-full btn-primary h-[52px] text-lg"
            >
              التالي
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Occupation Selection */}
      {step === 3 && (
        <div className="flex flex-1 flex-col p-8">
          <Logo className="mb-8" />
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-cairo mb-2">وش طبيعة عملك؟</h1>
            <p className="text-growup-text">اختر مجال عملك الحالي</p>
          </div>
          
          <div className="flex flex-col gap-3 mb-8 h-64 overflow-y-auto">
            {OCCUPATIONS.map((occupation) => (
              <button
                key={occupation.id}
                className={`p-4 rounded-xl border-2 text-right font-cairo text-lg ${
                  selectedOccupation === occupation.id
                    ? 'border-growup bg-growup/10 font-bold'
                    : 'border-gray-200 hover:border-growup/50'
                }`}
                onClick={() => setSelectedOccupation(occupation.id)}
              >
                {occupation.label}
              </button>
            ))}
          </div>
          
          <div className="mt-auto">
            <Button 
              onClick={handleNext}
              disabled={!selectedOccupation}
              className="w-full btn-primary h-[52px] text-lg"
            >
              بدء الرحلة
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
