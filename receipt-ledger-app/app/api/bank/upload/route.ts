import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import prisma from "../../../../lib/prisma";

interface BankStatement {
  accountName: string;
  accountNumber: string;
  accountType: string;
  date: Date;
  description: string;
  moneyOut: number | null;
  moneyIn: number | null;
  balance: number;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "No CSV file provided" },
      { status: 400 }
    );
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const csvText = fileBuffer.toString("utf-8");

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error("Erro no parse:", parsed.errors);
    return NextResponse.json({ error: "CSV parse error" }, { status: 500 });
  }
  console.log("Parsed CSV data:", parsed.data);
  const entries = parsed.data as BankStatement[];

  const transactions = entries.map((row) => {
    const moneyOut = row.moneyOut || 0;
    const moneyIn = row.moneyIn || 0;

    return {
      accountName: row.accountName,
      accountType: row.accountType,
      accountNumber: row.accountNumber,
      date: new Date(row.date),
      description: row.description || "",
      moneyOut: moneyOut || null,
      moneyIn: moneyIn || null,
      balance: moneyIn - moneyOut,
    };
  });

  try {
    const result = await prisma.bankStatement.createMany({
      data: transactions,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "CSV parsed and saved", result });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}
