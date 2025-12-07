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

export async function POST(request: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { studentId } = await params;
  const student = await prisma.student.findFirst({
    where: { id: parseInt(studentId), pg: { ownerId: userId } }
  });

  if (!student) return NextResponse.json({ success: false }, { status: 404 });

  const { month, amount, dueDate } = await request.json();
  if (!month || !amount || !dueDate) {
    return NextResponse.json({ success: false, message: "Month, amount and dueDate required" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: { studentId: student.id, month, amount, dueDate: new Date(dueDate) }
  });

  return NextResponse.json({ success: true, payment }, { status: 201 });
}
