"use client";
import { useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, IndianRupee, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PG { id: number; name: string; address: string; _count: { students: number }; }

const fetchPGs = async () => {
  const res = await fetch("/api/pgs");
  if (!res.ok) throw new Error("Failed to fetch PGs");
  return res.json();
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pgs"],
    queryFn: fetchPGs,
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) router.push("/signin");
  }, [user, loading, router]);

  const stats = useMemo(() => {
    if (!data?.success) return { totalPgs: 0, totalStudents: 0, pending: 0, revenue: 0 };
    const totalStudents = data.pgs.reduce((sum: number, pg: PG) => sum + pg._count.students, 0);
    return {
      totalPgs: data.pgs.length,
      totalStudents,
      pending: Math.floor(totalStudents * 0.3) * 8000,
      revenue: totalStudents * 8000,
    };
  }, [data]);

  if (loading || isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;
  if (!user) return null;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Error loading data</div>;

  const activities = [
    { text: "New student Rahul Kumar added to Sunshine PG", time: "2 hours ago", color: "bg-green-500" },
    { text: "Rent received from Priya Sharma", time: "4 hours ago", color: "bg-green-500" },
    { text: "Maintenance request: Room 104 AC issue", time: "Yesterday", color: "bg-orange-500" },
    { text: "Room 201 became vacant", time: "2 days ago", color: "bg-gray-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your PG management performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPgs}</p>
                <p className="text-xs text-gray-500 mt-2">↗ +2 from last month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500 mt-2">↗ +12% occupancy rate</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Revenue (Monthly)</p>
                <p className="text-3xl font-bold text-gray-900">₹{(stats.revenue / 1000).toFixed(1)}L</p>
                <p className="text-xs text-gray-500 mt-2">↗ +4.5% from last month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Pending Dues</p>
                <p className="text-3xl font-bold text-gray-900">₹{(stats.pending / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500 mt-2">↘ {Math.floor(stats.totalStudents * 0.3)} students pending</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue collection for the current year</p>
            </div>
            <div className="h-64 w-full bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100 flex items-end justify-between p-4 relative overflow-hidden">
               {/* Mock Chart */}
               <svg className="absolute bottom-0 left-0 right-0 h-48 w-full" preserveAspectRatio="none">
                  <path d="M0,100 C100,50 200,150 300,80 C400,10 500,100 600,60 L600,200 L0,200 Z" fill="rgba(59, 130, 246, 0.1)" />
                  <path d="M0,100 C100,50 200,150 300,80 C400,10 500,100 600,60" fill="none" stroke="#3B82F6" strokeWidth="2" />
               </svg>
               <div className="w-full flex justify-between text-xs text-gray-400 z-10">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Latest updates from your properties</p>
            <div className="space-y-6">
              {activities.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${activity.color}`} />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
