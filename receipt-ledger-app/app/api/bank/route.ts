import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const bankEntries = await prisma.bankStatement.findMany();
  return NextResponse.json(bankEntries);
}

export async function POST(req: Request) {
  const body = await req.json();

  const bankEntry = await prisma.bankStatement.create({
    data: {
      accountName: body.accountName,
      accountType: body.accountType,
      accountNumber: body.accountNumber,
      date: body.date,
      description: body.description,
      moneyOut: body.moneyOut,
      moneyIn: body.moneyIn,
      balance: body.balance
    },
  });

  return NextResponse.json(bankEntry);
}