import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const receipts = await prisma.ledger.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(receipts);
}

export async function POST(req: Request) {
  const body = await req.json();

  const receipt = await prisma.ledger.create({
    data: {
      date: body.date,
      receiptNumber: body.receiptNumber,
      amountReceived: body.amountReceived,
      description: body.description,
      payorName: body.payorName,
      payeeName: body.payeeName,
      paymentMethod: body.paymentMethod,
      checkNumber: body.checkNumber,
      creditCardNumber: body.creditCardNumber,
      creditCardExp: body.creditCardExp,
      creditCardSec: body.creditCardSec
    },
  });

  return NextResponse.json(receipt);
}
