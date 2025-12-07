import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("welcome123", 10);
  let user = await prisma.user.findUnique({ where: { email: "ratneshrsrivastav@gmail.com" } });

  if (!user) {
    user = await prisma.user.create({
      data: { name: "Ratnesh Srivastav", email: "ratneshrsrivastav@gmail.com", passwordHash }
    });
  }

  const pg1 = await prisma.pG.create({
    data: { 
      name: "Sunrise PG", 
      address: "123 MG Road, Bangalore", 
      ownerId: user.id,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  });

  const pg2 = await prisma.pG.create({
    data: { 
      name: "Green Valley Hostel", 
      address: "45 Koramangala, Bangalore", 
      ownerId: user.id,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  });

  const students1 = await Promise.all([
    prisma.student.create({ data: { name: "Amit Kumar", email: "amit@email.com", phone: "9876543210", monthlyFee: 8000, pgId: pg1.id } }),
    prisma.student.create({ data: { name: "Priya Sharma", email: "priya@email.com", phone: "9876543211", monthlyFee: 8000, pgId: pg1.id } }),
    prisma.student.create({ data: { name: "Rahul Singh", email: "rahul@email.com", phone: "9876543212", monthlyFee: 7500, pgId: pg1.id } }),
  ]);

  const students2 = await Promise.all([
    prisma.student.create({ data: { name: "Sneha Patel", email: "sneha@email.com", phone: "9876543213", monthlyFee: 9000, pgId: pg2.id } }),
    prisma.student.create({ data: { name: "Vikram Reddy", email: "vikram@email.com", phone: "9876543214", monthlyFee: 9000, pgId: pg2.id } }),
  ]);

  for (const student of [...students1, ...students2]) {
    await prisma.payment.create({
      data: { studentId: student.id, month: "November 2025", amount: student.monthlyFee, dueDate: new Date("2025-11-05"), paid: true, paidAt: new Date("2025-11-03") }
    });
    await prisma.payment.create({
      data: { studentId: student.id, month: "December 2025", amount: student.monthlyFee, dueDate: new Date("2025-12-05"), paid: false }
    });
  }

  return { user, pgs: [pg1, pg2], students: [...students1, ...students2] };
}
