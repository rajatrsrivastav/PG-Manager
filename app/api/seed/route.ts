import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ success: true, message: "Database seeded", data: result });
  } catch (error) {
    console.error("Seed error:", error);
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
