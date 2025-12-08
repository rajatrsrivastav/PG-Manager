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
      <div className="mb-8">
        <div><h1 className="text-2xl font-bold text-foreground">Fees & Payments</h1><p className="text-muted-foreground">Track payments, dues, and transaction history.</p></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-black"><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Collected This Month</p><p className="text-3xl font-bold text-foreground">₹{stats.collected.toLocaleString()}</p></CardContent></Card>
        <Card className="border-l-4 border-l-black"><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Pending Dues</p><p className="text-3xl font-bold text-foreground">₹{stats.pending.toLocaleString()}</p></CardContent></Card>
        <Card className="border-l-4 border-l-black"><CardContent className="p-6"><p className="text-sm text-muted-foreground mb-1">Overdue (30+ days)</p><p className="text-3xl font-bold text-foreground">₹{stats.overdue.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b"><h3 className="font-semibold text-foreground">Recent Transactions</h3><p className="text-sm text-muted-foreground">Latest payment activities across all properties.</p></div>
          {stats.sortedPayments.length === 0 ? (
            <div className="p-12 text-center"><p className="text-muted-foreground">No payment records yet</p></div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary border-b"><tr><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Transaction ID</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Student</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Type</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Date</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Amount</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Status</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Action</th></tr></thead>
              <tbody className="divide-y">
                {stats.sortedPayments.map((p, i) => {
                  const isOverdue = !p.paid && new Date(p.dueDate) < new Date();
                  return (
                    <tr key={p.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-4 text-sm text-muted-foreground">TXN-{String(i + 1).padStart(3, "0")}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{p.student.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.month}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(p.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td className="px-6 py-4 font-medium text-foreground">₹{p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">{p.paid ? (<span className="inline-flex items-center gap-1 text-foreground"><Check className="h-4 w-4" /> Success</span>) : isOverdue ? (<span className="inline-flex items-center gap-1 text-destructive"><AlertCircle className="h-4 w-4" /> Failed</span>) : (<span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" /> Pending</span>)}</td>
                      <td className="px-6 py-4"><Button size="sm" variant="ghost" onClick={() => togglePaid(p.id, p.paid)}>{p.paid ? "Mark Unpaid" : "Mark Paid"}</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
