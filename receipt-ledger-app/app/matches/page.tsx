import * as React from "react"
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface ComparisonResponse {
  matches: {
    ledger: {
      id: string;
      date: string;
      amountReceived: number;
      description: string;
    };
    bank: {
      id: string;
      date: string;
      moneyIn?: number;
      moneyOut?: number;
      description: string;
    };
  }[];
  onlyInLedger: {
    id: string;
    date: string;
    amountReceived: number;
    description: string;
  }[];
  onlyInBank: {
    id: string;
    date: string;
    moneyIn?: number;
    moneyOut?: number;
    description: string;
  }[];
}


export default async function MatchesPage() {

    const data: ComparisonResponse = await fetch('/api/comparison', {
        cache: 'no-store',
    }).then(res => res.json());

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[oklch(0.72_0.18_306)] to-[oklch(0.50_0.24_302)] shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold">🏦 The Ledger</h1>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-purple">Menu</NavigationMenuTrigger>
                                <NavigationMenuContent className="bg-white shadow-lg rounded-lg">
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600" asChild>
                                        <Link href="/">
                                            Home
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600" asChild>
                                        <Link href="/ledger-data">
                                            Ledger
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600" asChild>
                                        <Link href="/bank-statement">
                                            Bank Statement
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center min-h-screen pt-20">

                <div className="bg-white/70 backdrop-blur-md border border-purple-200 shadow-lg rounded-xl p-6 w-full max-w-6xl">
                    <Table className="w-full">
                        <TableCaption className="text-center text-purple-900 font-semibold mb-4">
                            💼 Reconciliation Overview (Ledger x Bank Statement)
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="bg-purple-100">
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Ledger ID</TableHead>
                                <TableHead>Bank ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                ...data!.matches.map((entry) => ({
                                    type: "✅ Match",
                                    date: entry.bank.date,
                                    amount: entry.ledger.amountReceived,
                                    description: entry.ledger.description,
                                    ledgerId: entry.ledger.id,
                                    bankId: entry.bank.id,
                                })),
                                ...data!.onlyInLedger.map((entry) => ({
                                    type: "🧾 Only Ledger",
                                    date: entry.date,
                                    amount: entry.amountReceived,
                                    description: entry.description,
                                    ledgerId: entry.id,
                                    bankId: null,
                                })),
                                ...data!.onlyInBank.map((entry) => ({
                                    type: "💵 Only Bank",
                                    date: entry.date,
                                    amount: entry.moneyIn ?? entry.moneyOut,
                                    description: entry.description,
                                    ledgerId: null,
                                    bankId: entry.id,
                                })),
                            ].map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                    <TableCell>${Number(row.amount).toFixed(2)}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.ledgerId ?? "—"}</TableCell>
                                    <TableCell>{row.bankId ?? "—"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
