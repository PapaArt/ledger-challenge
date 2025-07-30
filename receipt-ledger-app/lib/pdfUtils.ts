import { PaymentMethod } from "@prisma/client";

export function extractFromText(text: string) {
  const dateMatch = text.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
  const receiptNumberMatch = text.match(/Receipt Number:\s*(\d+)/);
  const amountMatch = text.match(/Amount Received:\s*\$([\d.]+)/);
  const payorMatch = text.match(/Paid by:\s*(.*)/);
  const payeeMatch = text.match(/Received by:\s*(.*)/);
  const descriptionMatch = text.match(/For the Payment of:\s*(.*)/);
  const paymentMethodMatch = text.match(
    /Payment Method:\s*(Cash|Check|Credit Card|Other)/i
  );

  const creditCardNumberMatch = text.match(/Credit Card Number:\s*([\d\s]+)/);
  const creditCardExpMatch = text.match(/Exp\.\s*\[?(\d{2})\s*\/\s*(\d{4})\]?/);
  const securityCodeMatch = text.match(/Sec\. Code:\s*(\d{3,4})/);

  // Map string to valid enum value
  const normalizePaymentMethod = (methodRaw: string): PaymentMethod => {
    const method = methodRaw.toLowerCase();
    if (method.includes("credit")) return "CREDIT_CARD";
    if (method.includes("cash")) return "CASH";
    if (method.includes("check")) return "CHECK";
    return "OTHER";
  };

  return {
    date: dateMatch ? new Date(dateMatch[1]) : new Date(),
    receiptNumber: receiptNumberMatch?.[1] ?? "0000",
    amount: parseFloat(amountMatch?.[1] ?? "0"),
    description: descriptionMatch?.[1]?.trim() ?? "No description",
    payor: payorMatch?.[1]?.trim() ?? "Unknown",
    payee: payeeMatch?.[1]?.trim() ?? "Unknown",
    paymentMethod: paymentMethodMatch
      ? normalizePaymentMethod(paymentMethodMatch[1])
      : "OTHER",
    creditCardNumber: creditCardNumberMatch?.[1]?.replace(/\s+/g, "") ?? null,
    creditCardExp: creditCardExpMatch
      ? `${creditCardExpMatch[1]}/${creditCardExpMatch[2]}`
      : null,
    creditCardSec: securityCodeMatch?.[1] ?? null,
  };
}

// export function extractFromText(text: string) {
//   // Adapte conforme a estrutura dos seus recibos
//   const dateMatch = text.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
//   const receiptNumberMatch = text.match(/Receipt Number:\s*(\d+)/);
//   const amountMatch = text.match(/Amount Received:\s*\$([\d.]+)/);
//   const payorMatch = text.match(/Paid by:\s*(.*)/);
//   const payeeMatch = text.match(/Received by:\s*(.*)/);
//   const descriptionMatch = text.match(/For the Payment of:\s*(.*)/);
//   const paymentMethodMatch = text.match(/Payment Method:\s*(Cash|Check|Credit Card|Other)/i);

//   return {
//     date: dateMatch ? new Date(dateMatch[1]) : new Date(),
//     receiptNumber: receiptNumberMatch?.[1] ?? "0000",
//     amount: parseFloat(amountMatch?.[1] ?? "0"),
//     description: descriptionMatch?.[1] ?? "No description",
//     payor: payorMatch?.[1]?.trim() ?? "Unknown",
//     payee: payeeMatch?.[1]?.trim() ?? "Unknown",
//     paymentMethod: (paymentMethodMatch?.[1] ?? "OTHER").toUpperCase(),
//   };
// }
