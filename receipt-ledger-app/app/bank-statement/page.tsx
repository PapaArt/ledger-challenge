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
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


export default async function BankStatements() {

    const bankStatements = await prisma.bankStatement.findMany({
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
                                        <Link href="/ledger-data">
                                            Ledger
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 pt-24">
                <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                        {bankStatements.map((statement, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="bg-white/70 backdrop-blur-md border border-purple-200 shadow-lg rounded-xl">
                                        <CardContent className="p-6 space-y-2 text-sm text-gray-700 select-none">
                                            <h3 className="text-lg font-semibold text-purple-800 mb-2">🏦 Transaction</h3>
                                            <p><span className="font-medium">Account:</span> {statement.accountName}</p>
                                            <p><span className="font-medium">Account No:</span> {statement.accountNumber}</p>
                                            <p><span className="font-medium">Type:</span> {statement.accountType}</p>
                                            <p><span className="font-medium">Date:</span> {new Date(statement.date).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Description:</span> {statement.description}</p>
                                            <p>
                                                <span className="font-medium">Money In:</span>{" "}
                                                <span className="text-green-600">${statement.moneyIn?.toFixed(2) ?? "0.00"}</span>
                                            </p>
                                            <p>
                                                <span className="font-medium">Money Out:</span>{" "}
                                                <span className="text-red-600">${statement.moneyOut?.toFixed(2) ?? "0.00"}</span>
                                            </p>
                                            <p><span className="font-medium">Balance:</span> ${statement.balance?.toFixed(2) ?? "0.00"}</p>
                                        </CardContent>
                                    </Card>

                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </>
    );
}