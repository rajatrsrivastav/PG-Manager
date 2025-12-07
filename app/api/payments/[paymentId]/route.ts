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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ paymentId: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { paymentId } = await params;
  const payment = await prisma.payment.findFirst({
    where: { id: parseInt(paymentId), student: { pg: { ownerId: userId } } }
  });

  if (!payment) return NextResponse.json({ success: false }, { status: 404 });

  const { paid } = await request.json();
  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: { paid, paidAt: paid ? new Date() : null }
  });

  return NextResponse.json({ success: true, payment: updated });
}
