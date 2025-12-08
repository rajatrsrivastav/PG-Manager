"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit2, Trash2, X, Mail, Phone, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Student { id: number; name: string; email: string | null; phone: string | null; monthlyFee: number; pgId: number; pg?: { name: string }; payments: { paid: boolean }[]; }

const fetchStudentsData = async () => {
  const res = await fetch("/api/pgs");
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();
  if (!data.success) throw new Error("Failed to fetch data");
  
  const pgs = data.pgs.map((pg: { id: number; name: string }) => ({ id: pg.id, name: pg.name }));
  const allStudents: Student[] = [];
  
  for (const pg of data.pgs) {
    const pgRes = await fetch(`/api/pgs/${pg.id}`);
    const pgData = await pgRes.json();
    if (pgData.success && pgData.pg.students) {
      allStudents.push(...pgData.pg.students.map((s: Student) => ({ ...s, pg: { name: pg.name } })));
    }
  }
  
  return { pgs, students: allStudents };
};

export default function Students() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", monthlyFee: "", pgId: "" });
  const [saving, setSaving] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["students-data"],
    queryFn: fetchStudentsData,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fetch(`/api/students/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["students-data"] }),
  });

  useEffect(() => { if (!loading && !user) router.push("/signin"); }, [user, loading, router]);

  const pgs = data?.pgs || [];
  const students = data?.students || [];

  const openAdd = () => { if (pgs.length === 0) { alert("Add a property first"); return; } setEditingStudent(null); setForm({ name: "", email: "", phone: "", monthlyFee: "", pgId: pgs[0].id.toString() }); setShowModal(true); };
  const openEdit = (student: Student) => { setEditingStudent(student); setForm({ name: student.name, email: student.email || "", phone: student.phone || "", monthlyFee: student.monthlyFee.toString(), pgId: student.pgId.toString() }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name || !form.pgId) return;
    setSaving(true);
    const payload = { name: form.name, email: form.email, phone: form.phone, monthlyFee: parseFloat(form.monthlyFee) || 0 };
    if (editingStudent) await fetch(`/api/students/${editingStudent.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    else await fetch(`/api/pgs/${form.pgId}/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setShowModal(false); setSaving(false); queryClient.invalidateQueries({ queryKey: ["students-data"] });
  };

  const handleDelete = async (student: Student) => { if (!confirm(`Delete "${student.name}"?`)) return; deleteMutation.mutate(student.id); };

  const filtered = students.filter((s: Student) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.pg?.name.toLowerCase().includes(search.toLowerCase()));

  if (loading || isLoading) return <div className="flex h-64 items-center justify-center">Loading...</div>;
  if (!user) return null;
  if (error) return <div className="flex h-64 items-center justify-center text-red-500">Error loading students</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div><h1 className="text-2xl font-bold text-foreground">Students</h1><p className="text-muted-foreground">Manage student records and assignments.</p></div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" /> Add Student</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b flex justify-between items-center">
            <div><h3 className="font-semibold text-foreground">All Students</h3></div>
            <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center"><p className="text-muted-foreground mb-4">No students found</p><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Student</Button></div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary border-b"><tr><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Student</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Contact</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">PG</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Status</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Payment</th><th className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase">Actions</th></tr></thead>
              <tbody className="divide-y">
                {filtered.map(student => {
                  const hasPending = student.payments?.some(p => !p.paid);
                  return (
                    <tr key={student.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium text-sm">{student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><p className="font-medium text-foreground">{student.name}</p><p className="text-xs text-muted-foreground">Added recently</p></div></div></td>
                      <td className="px-6 py-4 text-sm">{student.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="h-3 w-3" /> {student.email}</div>}{student.phone && <div className="flex items-center gap-1 text-muted-foreground mt-1"><Phone className="h-3 w-3" /> {student.phone}</div>}</td>
                      <td className="px-6 py-4"><p className="text-foreground">{student.pg?.name}</p></td>
                      <td className="px-6 py-4"><span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-black text-white">Active</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${hasPending ? "bg-secondary text-foreground border border-black" : "bg-black text-white"}`}>{hasPending ? "Pending" : "Paid"}</span></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1"><Button size="sm" variant="ghost" onClick={() => openEdit(student)}><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(student)}><Trash2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">{editingStudent ? "Edit Student" : "Add Student"}</h3><button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button></div><div className="space-y-4">{!editingStudent && (<div><Label>Property *</Label><select value={form.pgId} onChange={e => setForm({ ...form, pgId: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground">{pgs.map((pg: { id: number; name: string }) => <option key={pg.id} value={pg.id}>{pg.name}</option>)}</select></div>)}<div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1" /></div><div><Label>Email</Label><Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1" /></div><div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="mt-1" /></div><div><Label>Monthly Fee (₹)</Label><Input type="number" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} className="mt-1" /></div><div className="flex gap-3 pt-4"><Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button><Button onClick={handleSave} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">{saving ? "Saving..." : editingStudent ? "Update" : "Add"}</Button></div></div></div></div>)}
    </div>
  );
}
