import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phoneNumber, collegeIdCardUrl } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phoneNumber,
        collegeIdCardUrl,
        role: "STUDENT",
        status: "PENDING",
        application: {
          create: {
            status: "PENDING",
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        userId: user.id,
        message: "User registered successfully. Application pending approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
