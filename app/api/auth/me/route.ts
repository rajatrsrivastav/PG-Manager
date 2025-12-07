import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded = jwt.verify(token.value, JWT_SECRET) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true }
    });

    if (!user) return NextResponse.json({ success: false }, { status: 401 });
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
