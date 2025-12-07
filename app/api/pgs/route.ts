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

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const pgs = await prisma.pG.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { students: true } } }
  });
  return NextResponse.json({ success: true, pgs });
}

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ success: false }, { status: 401 });

  const { name, address, image } = await request.json();
  if (!name || !address) {
    return NextResponse.json({ success: false, message: "Name and address required" }, { status: 400 });
  }

  const pg = await prisma.pG.create({ data: { name, address, image, ownerId: userId } });
  return NextResponse.json({ success: true, pg }, { status: 201 });
}
