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
    { text: "New student added to Sunrise PG", time: "2 hours ago", color: "bg-black" },
    { text: "Rent received from Priya Sharma", time: "4 hours ago", color: "bg-gray-600" },
    { text: "Payment pending for Amit Kumar", time: "Yesterday", color: "bg-gray-400" },
    { text: "New property Urban Nest added", time: "2 days ago", color: "bg-black" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your PG management performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-black">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalPgs}</p>
                <p className="text-xs text-muted-foreground mt-2">↗ +2 from last month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-black">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground mt-2">↗ +12% occupancy rate</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Users className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-black">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue (Monthly)</p>
                <p className="text-3xl font-bold text-foreground">₹{(stats.revenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground mt-2">↗ +4.5% from last month</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-black">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Dues</p>
                <p className="text-3xl font-bold text-foreground">₹{(stats.pending / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground mt-2">↘ {Math.floor(stats.totalStudents * 0.3)} students pending</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Latest updates from your properties</p>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`} />
                <div>
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
