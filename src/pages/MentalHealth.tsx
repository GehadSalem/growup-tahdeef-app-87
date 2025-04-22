
import { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Play, Pause } from "lucide-react";

const MOODS = [
  { id: "great", emoji: "😄", label: "رائع" },
  { id: "good", emoji: "🙂", label: "جيد" },
  { id: "neutral", emoji: "😐", label: "محايد" },
  { id: "sad", emoji: "😔", label: "حزين" },
  { id: "stressed", emoji: "😫", label: "متوتر" },
];

const BREATHING_EXERCISE = {
  name: "تمرين التنفس 4-7-8",
  description: "استنشق لمدة 4 ثوانٍ، احبس النفس لمدة 7 ثوانٍ، ثم أخرج الزفير لمدة 8 ثوانٍ",
  steps: [
    { name: "استنشق", duration: 4 },
    { name: "احبس", duration: 7 },
    { name: "زفير", duration: 8 }
  ]
};

export default function MentalHealth() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [exerciseRunning, setExerciseRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [journal, setJournal] = useState("");
  
  const startBreathingExercise = () => {
    if (exerciseRunning) {
      setExerciseRunning(false);
      setCurrentStep(0);
      setTimeLeft(0);
      return;
    }
    
    setExerciseRunning(true);
    setCurrentStep(0);
    setTimeLeft(BREATHING_EXERCISE.steps[0].duration);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next step
          setCurrentStep(currentStep => {
            const nextStep = (currentStep + 1) % BREATHING_EXERCISE.steps.length;
            setTimeLeft(BREATHING_EXERCISE.steps[nextStep].duration);
            return nextStep;
          });
          return BREATHING_EXERCISE.steps[(currentStep + 1) % BREATHING_EXERCISE.steps.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const selectMood = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showBackButton title="الصحة النفسية" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Mood Tracker */}
        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo">كيف تشعر اليوم؟</CardTitle>
              <CardDescription className="text-right font-cairo">
                تتبع مزاجك اليومي يساعدك على فهم نفسك بشكل أفضل
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map(mood => (
                  <Button
                    key={mood.id}
                    variant="outline"
                    className={`flex flex-col items-center h-auto py-3 ${
                      selectedMood === mood.id ? 'border-growup bg-growup/10' : ''
                    }`}
                    onClick={() => selectMood(mood.id)}
                  >
                    <span className="text-2xl mb-1">{mood.emoji}</span>
                    <span className="text-sm font-cairo">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="justify-end">
              <Button
                className="bg-growup hover:bg-growup-dark"
                disabled={!selectedMood}
              >
                حفظ
              </Button>
            </CardFooter>
          </Card>
        </section>
        
        {/* Breathing Exercise */}
        <section className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo">تمارين التنفس</CardTitle>
              <CardDescription className="text-right font-cairo">
                التنفس العميق يساعد على تقليل التوتر والقلق
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-4">
                <h4 className="font-cairo font-bold mb-2">{BREATHING_EXERCISE.name}</h4>
                <p className="text-sm text-gray-600 font-cairo">{BREATHING_EXERCISE.description}</p>
              </div>
              
              {exerciseRunning && (
                <div className="relative flex flex-col items-center justify-center h-40 mb-4 bg-growup/5 rounded-xl">
                  <div className="absolute inset-0 rounded-xl">
                    <div 
                      className="h-full bg-growup/20 rounded-xl transition-all" 
                      style={{ 
                        width: `${(timeLeft / BREATHING_EXERCISE.steps[currentStep].duration) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl font-bold font-cairo mb-2">
                      {BREATHING_EXERCISE.steps[currentStep].name}
                    </div>
                    <div className="text-xl font-cairo">{timeLeft}</div>
                  </div>
                </div>
              )}
              
              <Button 
                className={`w-full ${exerciseRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-growup hover:bg-growup-dark'}`}
                onClick={startBreathingExercise}
              >
                {exerciseRunning ? (
                  <>
                    <Pause className="mr-0 ml-2 h-4 w-4" />
                    <span>إيقاف</span>
                  </>
                ) : (
                  <>
                    <Play className="mr-0 ml-2 h-4 w-4" />
                    <span>ابدأ التمرين</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>
        
        {/* Daily Journal */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-cairo">دفتر اليوميات</CardTitle>
              <CardDescription className="text-right font-cairo">
                سجل أفكارك ومشاعرك اليومية
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <textarea
                className="w-full h-32 p-3 text-right font-cairo border border-gray-200 rounded-lg resize-none focus:border-growup focus:outline-none focus:ring-1 focus:ring-growup"
                placeholder="ما الذي تشعر به اليوم؟ ما هي أفكارك؟"
                value={journal}
                onChange={e => setJournal(e.target.value)}
              />
            </CardContent>
            
            <CardFooter className="justify-end">
              <Button className="bg-growup hover:bg-growup-dark">
                حفظ
              </Button>
            </CardFooter>
          </Card>
        </section>
        
        {/* Daily Motivation */}
        <section className="mt-6">
          <Card className="bg-gradient-to-br from-growup/20 to-growup/5 border-none">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold font-cairo mb-3 text-center">اقتباس اليوم</h3>
              <p className="text-center font-cairo text-lg">
                "خلك طيب مع نفسك، قبل غيرك."
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
