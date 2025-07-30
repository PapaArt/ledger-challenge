-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CHECK', 'CREDIT_CARD', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Ledger" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptNumber" TEXT,
    "amountReceived" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "payorName" TEXT NOT NULL,
    "payeeName" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "checkNumber" TEXT,
    "creditCardNumber" TEXT,
    "creditCardExp" TEXT,
    "creditCardSec" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankStatement" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "moneyOut" DOUBLE PRECISION,
    "moneyIn" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankStatement_pkey" PRIMARY KEY ("id")
);
