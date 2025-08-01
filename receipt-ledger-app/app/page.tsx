import Image from "next/image";
import { GridWrapper } from "./components/GridWrapper";
import { AnimatedText } from "./components/AnimatedText";
import { NavCard } from "./components/NavCard";
import { Button } from "@/components/ui/button"
import { IconDeviceDesktopAnalytics } from "@tabler/icons-react";



export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="mt-6 space-y-10 md:mt-0 md:space-y-16">
          <section>
            <div className="relative text-balance">
              <GridWrapper>
                <AnimatedText
                  as="h1"
                  delay={0.2}
                  className="mx-auto max-w-2xl text-center text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]"
                >
                  <div className="text-center text-5xl mb-2">
                    <Image
                      src="/banco.png"
                      alt="Banco"
                      width={128}
                      height={128}
                      className="mx-auto"
                    />
                  </div>
                  Welcome to <span className="text-emerald-400 font-semibold">THE LEDGER</span>
                </AnimatedText>
              </GridWrapper>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
                <AnimatedText delay={0.2}>
                  <NavCard
                    emoji="📄"
                    title="Ledger"
                    description="Manage and see your receipt entries"
                    href="/ledger-data"
                  />
                </AnimatedText>

                <AnimatedText delay={0.4}>
                  <NavCard
                    emoji="💰"
                    title="Bank Statement"
                    description="Manage and view your bank statement"
                    href="/bank-statement"
                  />
                </AnimatedText>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <AnimatedText delay={0.6}>
                <Button variant="outline" size="lg">
                  Explore your data <IconDeviceDesktopAnalytics />
                </Button>
              </AnimatedText>
            </div>
          </section>
        </div>
      </main >
    </div >
  );
}
