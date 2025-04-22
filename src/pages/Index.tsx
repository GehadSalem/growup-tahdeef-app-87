
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to onboarding page
    navigate('/onboarding');
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default Index;
