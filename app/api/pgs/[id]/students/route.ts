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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const pgId = parseInt(id);

  const pg = await prisma.pG.findFirst({ where: { id: pgId, ownerId: userId } });
  if (!pg) return NextResponse.json({ success: false }, { status: 404 });

  const { name, email, phone, monthlyFee } = await request.json();
  if (!name) return NextResponse.json({ success: false, message: "Name required" }, { status: 400 });

  const student = await prisma.student.create({
    data: { name, email, phone, monthlyFee: monthlyFee || 0, pgId }
  });

  return NextResponse.json({ success: true, student }, { status: 201 });
}
