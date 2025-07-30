import { IncomingForm } from "formidable";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import PDFParser from "pdf2json";
import { extractFromText } from "../../../lib/pdfUtils";

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("filepond");

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json({ error: "Arquivo inválido." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    const pdfParser = new (PDFParser as any)(null, 1);

    const parsedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err: any) => {
        console.error("Error parsing PDF:", err);
        reject("Error parsing PDF");
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = (pdfParser as any).getRawTextContent();
        resolve(text);
        //   console.log((pdfParser as any).getRawTextContent());
        //   parsedText = (pdfParser as any).getRawTextContent();
      });

      pdfParser.parseBuffer(fileBuffer);
    });

    const extractedData = extractFromText(parsedText);

    try {
      const ledgerResponse = await fetch("http://localhost:3000/api/ledger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: extractedData.date,
          receiptNumber: extractedData.receiptNumber,
          amountReceived: extractedData.amount,
          description: extractedData.description,
          payorName: extractedData.payor,
          payeeName: extractedData.payee,
          paymentMethod: extractedData.paymentMethod,
          creditCardNumber: extractedData.creditCardNumber,
          creditCardExp: extractedData.creditCardExp,
          creditCardSec: extractedData.creditCardSec,
          checkNumber: extractedData.paymentMethod === "CHECK" ? uuidv4() : null
        }),
      });

      return NextResponse.json({
        message: "Data sent to ledger API successfully",
        ledgerResponse: await ledgerResponse.json(),
      });
    } catch (error) {
      console.error("Error sending data to ledger API:", error);
      return NextResponse.json(
        { error: "Failed to send data to ledger API" },
        { status: 500 }
      );
    }
  }
}
