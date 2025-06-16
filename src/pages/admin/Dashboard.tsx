import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, UserCheck, TrendingUp } from 'lucide-react';
import { DashboardStatsService } from '@/services/dashboardStatsService';
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalHabits: number;
  completedHabits: number;
  totalExpenses: number;
  totalSavings: number;
}

export default function AdminDashboard() {
  const [filter, setFilter] = useState('monthly');
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: DashboardStatsService.getDashboardStats,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">لوحة التحكم - المدير</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Filter Controls */}
        <div className="flex items-center justify-end mb-4">
          <label htmlFor="filter" className="ml-2">تصفية:</label>
          <select
            id="filter"
            className="border rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
          </select>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات الإجمالية</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 'جاري التحميل...' : `${dashboardStats?.totalRevenue || 0} ر.س`}
              </div>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 'جاري التحميل...' : dashboardStats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>

          {/* Active Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 'جاري التحميل...' : dashboardStats?.activeUsers || 0}
              </div>
            </CardContent>
          </Card>

          {/* Growth Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نمو شهري</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? 'جاري التحميل...' : `${dashboardStats?.monthlyGrowth || 0}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">جاري التحميل...</div>
                </div>
              ) : (
                <div className="h-64">
                  {/* Revenue chart content */}
                  <div className="text-center text-gray-500">
                    مخطط الإيرادات
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Registration Chart */}
          <Card>
            <CardHeader>
              <CardTitle>تسجيل المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">جاري التحميل...</div>
                </div>
              ) : (
                <div className="h-64">
                  {/* User registration chart content */}
                  <div className="text-center text-gray-500">
                    مخطط تسجيل المستخدمين
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>آخر النشاطات</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>نشاط 1</li>
              <li>نشاط 2</li>
              <li>نشاط 3</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
