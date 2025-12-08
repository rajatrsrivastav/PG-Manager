"use client";
import { useState, useEffect, use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Edit2, Trash2, X, Check, Clock, Mail, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Student { id: number; name: string; email: string | null; phone: string | null; monthlyFee: number; payments: Payment[]; }
interface Payment { id: number; month: string; amount: number; paid: boolean; dueDate: string; }
interface PG { id: number; name: string; address: string; students: Student[]; }

const fetchPG = async (id: string) => {
  const res = await fetch(`/api/pgs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch PG");
  const data = await res.json();
  if (!data.success) throw new Error("PG not found");
  return data.pg;
};

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showFeeModal, setShowFeeModal] = useState<number | null>(null);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", phone: "", monthlyFee: "" });
  const [feeForm, setFeeForm] = useState({ month: "", amount: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const { data: pg, isLoading, error } = useQuery({
    queryKey: ["pg", id],
    queryFn: () => fetchPG(id),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId: number) => fetch(`/api/students/${studentId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pg", id] }),
  });

  const togglePaidMutation = useMutation({
    mutationFn: ({ paymentId, paid }: { paymentId: number; paid: boolean }) =>
      fetch(`/api/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paid: !paid }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pg", id] }),
  });

  useEffect(() => { if (!loading && !user) router.push("/signin"); }, [user, loading, router]);
  useEffect(() => { if (error) router.push("/properties"); }, [error, router]);

  const openAddStudent = () => { setEditingStudent(null); setStudentForm({ name: "", email: "", phone: "", monthlyFee: "" }); setShowStudentModal(true); };
  const openEditStudent = (student: Student) => { setEditingStudent(student); setStudentForm({ name: student.name, email: student.email || "", phone: student.phone || "", monthlyFee: student.monthlyFee.toString() }); setShowStudentModal(true); };

  const handleSaveStudent = async () => {
    if (!studentForm.name) return;
    setSaving(true);
    const payload = { ...studentForm, monthlyFee: parseFloat(studentForm.monthlyFee) || 0 };
    if (editingStudent) await fetch(`/api/students/${editingStudent.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    else await fetch(`/api/pgs/${id}/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setShowStudentModal(false); setSaving(false); queryClient.invalidateQueries({ queryKey: ["pg", id] });
  };

  const handleDeleteStudent = (student: Student) => { if (!confirm(`Delete "${student.name}"?`)) return; deleteMutation.mutate(student.id); };
  const handleAddFee = async (studentId: number) => { if (!feeForm.month || !feeForm.amount || !feeForm.dueDate) return; setSaving(true); await fetch(`/api/students/${studentId}/fees`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...feeForm, amount: parseFloat(feeForm.amount) }) }); setFeeForm({ month: "", amount: "", dueDate: "" }); setShowFeeModal(null); setSaving(false); queryClient.invalidateQueries({ queryKey: ["pg", id] }); };
  const togglePaid = (paymentId: number, paid: boolean) => { togglePaidMutation.mutate({ paymentId, paid }); };

  if (loading || isLoading || !pg) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/properties")}><ArrowLeft className="h-5 w-5" /></Button>
        <div className="flex-1"><h1 className="text-2xl font-bold text-foreground">{pg.name}</h1><p className="text-muted-foreground">{pg.address}</p></div>
        <Button onClick={openAddStudent} className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" /> Add Student</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-border"><h3 className="font-semibold text-foreground">All Students</h3><p className="text-sm text-muted-foreground">{pg.students.length} students enrolled</p></div>
          {pg.students.length === 0 ? (
            <div className="p-12 text-center"><p className="text-muted-foreground mb-4">No students enrolled yet</p><Button onClick={openAddStudent}><Plus className="h-4 w-4 mr-2" /> Add First Student</Button></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-border"><tr><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Student</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Contact</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Monthly Fee</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Status</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {pg.students.map((student: Student) => {
                    const hasPending = student.payments.some(p => !p.paid);
                    return (
                      <tr key={student.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium">{student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><p className="font-medium text-foreground">{student.name}</p><p className="text-xs text-muted-foreground">Added recently</p></div></div></td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</div>}{student.phone && <div className="flex items-center gap-1 mt-1"><Phone className="h-3 w-3" /> {student.phone}</div>}</td>
                        <td className="px-6 py-4"><span className="font-medium text-foreground">₹{student.monthlyFee.toLocaleString()}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${hasPending ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"}`}>{hasPending ? "Pending" : "Paid"}</span></td>
                        <td className="px-6 py-4"><div className="flex items-center gap-2"><Button size="sm" variant="ghost" onClick={() => setShowFeeModal(student.id)}><Plus className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => openEditStudent(student)}><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeleteStudent(student)}><Trash2 className="h-4 w-4" /></Button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {pg.students.some((s: Student) => s.payments.length > 0) && (
        <Card className="mt-6"><CardContent className="p-6"><h3 className="font-semibold text-foreground mb-4">Payment Records</h3><div className="space-y-3">{pg.students.flatMap((s: Student) => s.payments.map(p => ({ ...p, studentName: s.name }))).sort((a: any, b: any) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 10).map((p: any) => (<div key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50"><div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${p.paid ? "bg-green-500" : "bg-amber-500"}`} /><div><span className="font-medium text-foreground">{p.studentName}</span><span className="text-muted-foreground mx-2">•</span><span className="text-muted-foreground">{p.month}</span></div></div><div className="flex items-center gap-4"><span className="font-medium text-foreground">₹{p.amount.toLocaleString()}</span><Button size="sm" variant={p.paid ? "default" : "outline"} className={p.paid ? "bg-green-600 hover:bg-green-700" : ""} onClick={() => togglePaid(p.id, p.paid)}>{p.paid ? <><Check className="h-3 w-3 mr-1" /> Paid</> : <><Clock className="h-3 w-3 mr-1" /> Pending</>}</Button></div></div>))}</div></CardContent></Card>
      )}

      {showStudentModal && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"><div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-foreground">{editingStudent ? "Edit Student" : "Add Student"}</h3><button onClick={() => setShowStudentModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button></div><div className="space-y-4"><div><Label>Name *</Label><Input value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} className="mt-1" /></div><div><Label>Email</Label><Input value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} className="mt-1" /></div><div><Label>Phone</Label><Input value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} className="mt-1" /></div><div><Label>Monthly Fee (₹)</Label><Input type="number" value={studentForm.monthlyFee} onChange={e => setStudentForm({...studentForm, monthlyFee: e.target.value})} className="mt-1" /></div><div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => setShowStudentModal(false)} className="flex-1">Cancel</Button><Button onClick={handleSaveStudent} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">{saving ? "Saving..." : editingStudent ? "Update" : "Add"}</Button></div></div></div></div>)}

      {showFeeModal && (<div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"><div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-foreground">Add Fee Record</h3><button onClick={() => setShowFeeModal(null)}><X className="h-5 w-5 text-muted-foreground" /></button></div><div className="space-y-4"><div><Label>Month *</Label><Input value={feeForm.month} onChange={e => setFeeForm({...feeForm, month: e.target.value})} placeholder="January 2026" className="mt-1" /></div><div><Label>Amount (₹) *</Label><Input type="number" value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} className="mt-1" /></div><div><Label>Due Date *</Label><Input type="date" value={feeForm.dueDate} onChange={e => setFeeForm({...feeForm, dueDate: e.target.value})} className="mt-1" /></div><div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => setShowFeeModal(null)} className="flex-1">Cancel</Button><Button onClick={() => handleAddFee(showFeeModal)} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">{saving ? "Adding..." : "Add Fee"}</Button></div></div></div></div>)}
    </div>
  );
}
