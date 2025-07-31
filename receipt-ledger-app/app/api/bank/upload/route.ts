import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import prisma from "../../../../lib/prisma";

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

  const entries = parsed.data as any[];

  const transactions = entries.map((row) => {
    const moneyOut = parseFloat(row["Money Out"] || "0") || 0;
    const moneyIn = parseFloat(row["Money In"] || "0") || 0;

    return {
      accountName: row["Account Name"] || "",
      accountType: row["Account Type"] || "",
      accountNumber: row["Account Number"] || "",
      date: new Date(row["Date"]),
      description: row["Description"] || "",
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
