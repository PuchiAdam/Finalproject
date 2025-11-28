import { SearchBar } from "@/components/SearchBar";
import { MarketOverview } from "@/components/MarketOverview";
import { Portfolio } from "@/components/Portfolio";
import { SectorPerformance } from "@/components/SectorPerformance";
import { MarketMovers } from "@/components/MarketMovers";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Market Insight
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time stock analysis and intelligent investment advice powered by advanced technical indicators.
          </p>
        </div>

        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 space-y-8">
          <MarketOverview />
          <SearchBar />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            <div className="lg:col-span-2">
              <Portfolio />
            </div>
            <div>
              <MarketMovers />
            </div>
          </div>
        </div>
        <div className="w-full max-w-5xl">
          <SectorPerformance />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          title="Real-time Data"
          description="Access up-to-the-minute market data and historical trends for any stock."
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6 text-yellow-400" />}
          title="Instant Analysis"
          description="Get immediate buy/sell/hold recommendations based on technical analysis."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
          title="Risk Assessment"
          description="Evaluate potential risks and market volatility before you invest."
        />
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
