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

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const pg = await prisma.pG.findFirst({
    where: { id: parseInt(id), ownerId: userId },
    include: { students: { include: { payments: { orderBy: { dueDate: "desc" } } } } }
  });

  if (!pg) return NextResponse.json({ success: false }, { status: 404 });
  return NextResponse.json({ success: true, pg });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const { name, address, image } = await request.json();

  const pg = await prisma.pG.updateMany({
    where: { id: parseInt(id), ownerId: userId },
    data: { 
      ...(name && { name }), 
      ...(address && { address }),
      ...(image && { image })
    }
  });

  if (pg.count === 0) return NextResponse.json({ success: false }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { id } = await params;
  const pgId = parseInt(id);

  await prisma.payment.deleteMany({ where: { student: { pgId } } });
  await prisma.student.deleteMany({ where: { pgId } });
  await prisma.pG.deleteMany({ where: { id: pgId, ownerId: userId } });

  return NextResponse.json({ success: true });
}
