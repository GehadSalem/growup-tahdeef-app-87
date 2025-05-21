
import React from 'react';

export const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);
