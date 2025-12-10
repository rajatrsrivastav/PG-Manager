"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Payment { id: number; month: string; amount: number; paid: boolean; dueDate: string; student: { name: string; pg: { name: string } }; }

const fetchPaymentsData = async () => {
  const res = await fetch("/api/pgs");
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch data");
  
  const allPayments: Payment[] = [];
  for (const pg of data.pgs) {
    const pgRes = await fetch(`/api/pgs/${pg.id}`);
    const pgData = await pgRes.json();
    if (pgData.success && pgData.pg.students) {
      for (const student of pgData.pg.students) {
        allPayments.push(...student.payments.map((p: Payment) => ({ ...p, student: { name: student.name, pg: { name: pg.name } } })));
      }
    }
  }
  return allPayments;
};

export default function Fees() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPaymentsData,
    enabled: !!user,
  });

  const togglePaidMutation = useMutation({
    mutationFn: ({ paymentId, paid }: { paymentId: number; paid: boolean }) =>
      fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: !paid }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });

  useEffect(() => { if (!loading && !user) router.push("/signin"); }, [user, loading, router]);

  const stats = useMemo(() => {
    const sortedPayments = [...payments].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    const collected = payments.filter(p => p.paid).reduce((sum, p) => sum + p.amount, 0);
    const pending = payments.filter(p => !p.paid).reduce((sum, p) => sum + p.amount, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const overdue = payments.filter(p => !p.paid && new Date(p.dueDate) < thirtyDaysAgo).reduce((sum, p) => sum + p.amount, 0);
    return { collected, pending, overdue, sortedPayments };
  }, [payments]);

  const togglePaid = (paymentId: number, paid: boolean) => {
    togglePaidMutation.mutate({ paymentId, paid });
  };

  if (loading || isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;
  if (!user) return null;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Error loading payments</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-gray-500 mt-1">Track payments, dues, and transaction history.</p>
        </div>
        <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
          Export Report
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50 border border-green-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-green-700 mb-1">Collected This Month</p>
            <p className="text-3xl font-bold text-green-900">₹{stats.collected.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border border-yellow-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-yellow-700 mb-1">Pending Dues</p>
            <p className="text-3xl font-bold text-yellow-900">₹{stats.pending.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border border-red-100 shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-700 mb-1">Overdue (30+ days)</p>
            <p className="text-3xl font-bold text-red-900">₹{stats.overdue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-lg">Recent Transactions</h3>
            <p className="text-sm text-gray-500 mt-1">Latest payment activities across all properties.</p>
          </div>
          {stats.sortedPayments.length === 0 ? (
            <div className="p-16 text-center"><p className="text-gray-500">No payment records yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {stats.sortedPayments.map((p, i) => {
                    const isOverdue = !p.paid && new Date(p.dueDate) < new Date();
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">TXN-{String(i + 1).padStart(3, "0")}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{p.student.name}</td>
                        <td className="px-6 py-4 text-gray-500">{p.month}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(p.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">₹{p.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {p.paid ? (
                            <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium"><Check className="h-4 w-4" /> Success</span>
                          ) : isOverdue ? (
                            <span className="inline-flex items-center gap-1.5 text-red-600 text-sm font-medium"><AlertCircle className="h-4 w-4" /> Failed</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-yellow-600 text-sm font-medium"><Clock className="h-4 w-4" /> Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-900" onClick={() => togglePaid(p.id, p.paid)}>
                            Download
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
