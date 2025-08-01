import { Skeleton } from "@/components/ui/skeleton";
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
import prisma from "../../lib/prisma";
import Logo from "../../public/banco.png";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { Ledger } from "@prisma/client";

export default async function LedgerDataPage() {

    const ledgerEntries = await prisma.ledger.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 10, // Limit to the last 10 entries
    });

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
                                        <Link href="/matches">
                                            Matches
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

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 pt-24">
                <h2 className="text-3xl font-semibold mb-6 text-center text-purple-900">📄 Latest Receipts</h2>
                <div className="bg-white/70 backdrop-blur-md border border-purple-200 shadow-lg rounded-xl p-6 w-full max-w-6xl">
                    <Table className="w-full">
                        <TableCaption className="text-center text-purple-900 font-semibold">📊 Ledger Data</TableCaption>
                        <TableHeader>
                            <TableRow className="bg-purple-100">
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Payor</TableHead>
                                <TableHead>Payee</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerEntries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                                    <TableCell>${entry.amountReceived.toFixed(2)}</TableCell>
                                    <TableCell>{entry.payorName}</TableCell>
                                    <TableCell>{entry.payeeName}</TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-gray-500 text-sm text-center mt-4">
                    Don’t see what you’re looking for? Try uploading a new receipt.
                </p>
            </div>
        </>
    );

}