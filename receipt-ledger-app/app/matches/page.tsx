'use client';

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link";
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
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useEffect, useState } from 'react'


export default function MatchesPage() {
    const [data, setData] = useState<{
        matches: any[];
        onlyInLedger: any[];
        onlyInBank: any[];
    } | null>(null);

    console.log("Fetching data from /api/comparison");
    
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/comparison");
            console.log("Data fetched first:", res);
            const json = await res.json();
            setData(json);
        };

        fetchData();
    }, []);

    // console.log("Data fetched:", data);

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
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600">
                                        <Link href="/">
                                            Home
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600">
                                        <Link href="/ledger-data">
                                            Ledger
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-purple-600">
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

            <div className="w-full max-w-6xl bg-white/70 backdrop-blur-md border border-purple-200 shadow-lg rounded-xl p-6">
                <Table className="w-full select-none">
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
                            ...data!.matches.map((entry: any) => ({
                                type: "✅ Match",
                                date: entry.ledger.date,
                                amount: entry.ledger.amountReceived,
                                description: entry.ledger.description,
                                ledgerId: entry.ledger.id,
                                bankId: entry.bank.id,
                            })),
                            ...data!.onlyInLedger.map((entry: any) => ({
                                type: "🧾 Only Ledger",
                                date: entry.date,
                                amount: entry.amountReceived,
                                description: entry.description,
                                ledgerId: entry.id,
                                bankId: null,
                            })),
                            ...data!.onlyInBank.map((entry: any) => ({
                                type: "💵 Only Bank",
                                date: entry.date,
                                amount: entry.moneyOut ?? entry.moneyIn,
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

        </>
    );
}
