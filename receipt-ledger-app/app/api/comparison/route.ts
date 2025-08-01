import { NextResponse } from "next/server";
import prisma  from "../../../lib/prisma";

export async function GET() {
  const ledgerEntries = await prisma.ledger.findMany();
  const bankTransactions = await prisma.bankStatement.findMany();

  const matches = [];
  const onlyInLedger = [];
  const onlyInBank = [];

  const matchedBankIds = new Set();

  for (const ledger of ledgerEntries) {
    const match = bankTransactions.find((bank) => {
      const sameDate = new Date(ledger.date).toDateString() === new Date(bank.date).toDateString();
      const sameAmount =
        ledger.amountReceived === (bank.moneyOut ?? bank.moneyIn);
      return (sameDate && sameAmount);
    });

    if (match) {
      matches.push({ ledger, bank: match });
      matchedBankIds.add(match.id);
    } else {
      onlyInLedger.push(ledger);
    }
  }

  for (const bank of bankTransactions) {
    if (!matchedBankIds.has(bank.id)) {
      onlyInBank.push(bank);
    }
  }

  return NextResponse.json({
    matches,
    onlyInLedger,
    onlyInBank,
  });
}
