
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function EmailInviteForm() {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // إرسال دعوة عبر البريد الإلكتروني
  const sendEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    
    setIsLoading(true);
    
    // محاكاة إرسال الدعوة عبر البريد الإلكتروني
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`تم إرسال الدعوة إلى ${emailInput} بنجاح`);
      setEmailInput("");
    }, 1500);
  };

  return (
    <form onSubmit={sendEmailInvite}>
      <p className="mb-2 text-gray-700">دعوة صديق عبر البريد الإلكتروني</p>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="البريد الإلكتروني للصديق"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          required
          className="bg-gray-50"
        />
        <Button
          type="submit"
          variant="secondary"
          className="flex-shrink-0"
          disabled={isLoading}
        >
          {isLoading ? "جاري الإرسال..." : "دعوة"}
        </Button>
      </div>
    </form>
  );
}
