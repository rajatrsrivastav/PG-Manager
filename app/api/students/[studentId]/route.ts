import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch { return null; }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { studentId } = await params;
  const student = await prisma.student.findFirst({
    where: { id: parseInt(studentId), pg: { ownerId: userId } },
    include: { payments: { orderBy: { dueDate: "desc" } } }
  });

  if (!student) return NextResponse.json({ success: false }, { status: 404 });
  return NextResponse.json({ success: true, student });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { studentId } = await params;
  const { name, email, phone, monthlyFee } = await request.json();

  const student = await prisma.student.findFirst({
    where: { id: parseInt(studentId), pg: { ownerId: userId } }
  });

  if (!student) return NextResponse.json({ success: false }, { status: 404 });

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      ...(name && { name }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(monthlyFee !== undefined && { monthlyFee })
    }
  });

  return NextResponse.json({ success: true, student: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { studentId } = await params;
  const student = await prisma.student.findFirst({
    where: { id: parseInt(studentId), pg: { ownerId: userId } }
  });

  if (!student) return NextResponse.json({ success: false }, { status: 404 });

  await prisma.payment.deleteMany({ where: { studentId: student.id } });
  await prisma.student.delete({ where: { id: student.id } });

  return NextResponse.json({ success: true });
}
