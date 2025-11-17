-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'OVERDUE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "passwordHash" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "isCurrentOccupant" BOOLEAN NOT NULL DEFAULT false,
    "movedOutAt" TIMESTAMP(3),
    "collegeIdCard" TEXT,
    "collegeIdCardUrl" TEXT,
    "collegeIdCardPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedById" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "transactionReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_key" ON "applications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_studentId_month_key" ON "payments"("studentId", "month");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
