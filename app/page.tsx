import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bitcoin,
  Briefcase,
  CandlestickChart,
  ChevronRight,
  Gauge,
  Globe,
  Layers3,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Framework", href: "#framework" },
  { label: "Dial", href: "#dial" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Glossary", href: "#glossary" },
  { label: "Pricing", href: "#pricing" },
];

const macroCards = [
  {
    icon: Globe,
    title: "Business Cycle First",
    body: "MacroPulse begins with growth, inflation, policy, liquidity, and debt dynamics — then maps that framework into Bitcoin and broader crypto positioning.",
  },
  {
    icon: Gauge,
    title: "MacroPulse Dial",
    body: "A branded regime engine that converts macro and market-structure inputs into a clear signal: Sell, Hold, Buy Bitcoin, or Alt Season.",
  },
  {
    icon: CandlestickChart,
    title: "Actionable Weekly Notes",
    body: "Each issue includes market sentiment, a macro dashboard, Bitcoin setup, scenarios, and asset-allocation guidance built for serious investors.",
  },
];

const frameworkSteps = [
  {
    step: "01",
    title: "Read the macro regime",
    body: "Track growth, inflation, rates, refinancing pressure, and liquidity to identify whether the system is moving toward expansion, slowdown, or contraction.",
  },
  {
    step: "02",
    title: "Score the cycle",
    body: "Use the MacroPulse Dial to compress the highest-signal indicators into a single regime score and confidence level.",
  },
  {
    step: "03",
    title: "Confirm crypto rotation",
    body: "Use BTC Dominance and TOTAL3 to determine whether capital is staying in Bitcoin or broadening out into alts.",
  },
  {
    step: "04",
    title: "Allocate with discipline",
    body: "Translate the regime into practical guidance for BTC, ETH, alts, and cash instead of relying on narratives or emotion.",
  },
];

const glossary = [
  {
    term: "PMI",
    meaning: "Survey-based activity indicator where readings above 50 imply expansion.",
    importance: "One of the clearest leading indicators for business-cycle turning points and a core input for confirming alt-friendly conditions.",
    ticker: "ECONOMICS:USPMI",
    type: "Leading",
  },
  {
    term: "Global Liquidity",
    meaning: "A proxy for worldwide money and credit conditions across major economies.",
    importance: "The single most important macro driver for risk assets and one of the strongest structural tailwinds for crypto.",
    ticker: "Custom / composite",
    type: "Leading",
  },
  {
    term: "BTC Dominance",
    meaning: "Bitcoin’s share of total crypto market capitalization.",
    importance: "A key confirmation tool for whether capital is concentrating in BTC or rotating into alts.",
    ticker: "CRYPTOCAP:BTC.D",
    type: "Market Structure",
  },
  {
    term: "TOTAL3",
    meaning: "Total crypto market cap excluding BTC and ETH.",
    importance: "Confirms whether broad alt participation is actually expanding instead of relying on isolated token moves.",
    ticker: "CRYPTOCAP:TOTAL3",
    type: "Market Structure",
  },
  {
    term: "Yield Curve",
    meaning: "The spread between longer-term and shorter-term government yields.",
    importance: "A leading signal of shifting growth expectations and recession risk.",
    ticker: "US10Y-US02Y",
    type: "Leading",
  },
  {
    term: "Fed Funds",
    meaning: "The U.S. policy rate that sets the tone for borrowing costs and financial conditions.",
    importance: "Higher rates restrict liquidity and risk appetite; easing typically improves the environment for BTC and risk assets.",
    ticker: "ECONOMICS:FEDFUNDS",
    type: "Policy",
  },
];

const pricing = [
  {
    name: "Free",
    price: "£0",
    description: "Get introduced to the framework.",
    features: ["Intro framework", "Selected essays", "Occasional macro updates"],
  },
  {
    name: "Weekly",
    price: "£19/mo",
    featured: true,
    description: "The core MacroPulse product.",
    features: [
      "Weekly MacroPulse newsletter",
      "MacroPulse Dial update",
      "Allocation guidance",
      "Bitcoin and alt-regime commentary",
    ],
  },
  {
    name: "Pro",
    price: "£79/mo",
    description: "For deeper regime work.",
    features: [
      "Everything in Weekly",
      "Extended macro dashboard",
      "Deep-dive regime reports",
      "Premium archive access",
    ],
  },
];

const dialStates = {
  sell: {
    label: "Sell / Risk-Off",
    score: "-5.0",
    confidence: 82,
    pointer: 8,
    phase: "Contraction",
    summary: "PMI weak, liquidity contracting, and crypto breadth deteriorating.",
    pmi: "Below 50 and falling",
    liquidity: "Contracting",
    btcd: "Firm / rising",
    total3: "Breaking down",
    allocation: "BTC 0–20% · ETH 0–10% · Alts 0–5% · Cash/Stable 70–100%",
  },
  hold: {
    label: "Hold / Defensive",
    score: "-0.5",
    confidence: 61,
    pointer: 33,
    phase: "Late Cycle",
    summary: "Macro is mixed, risk appetite is selective, and BTC remains the higher-quality crypto exposure.",
    pmi: "Near 50 / mixed",
    liquidity: "Flat to mildly improving",
    btcd: "Stable",
    total3: "Unconfirmed",
    allocation: "BTC 50–70% · ETH 10–20% · Alts 0–10% · Cash/Stable 20–40%",
  },
  btc: {
    label: "Buy Bitcoin",
    score: "+3.0",
    confidence: 68,
    pointer: 58,
    phase: "Early Expansion",
    summary: "Liquidity is improving and macro conditions are becoming constructive, but alt confirmation is not yet broad enough.",
    pmi: "Improving / above 50 risk building",
    liquidity: "Expanding",
    btcd: "Still firm",
    total3: "Not yet breakout",
    allocation: "BTC 60–80% · ETH 10–20% · Alts 5–15% · Cash/Stable 10–20%",
  },
  alt: {
    label: "Alt Season",
    score: "+5.0",
    confidence: 78,
    pointer: 82,
    phase: "Expansion",
    summary: "PMI is consistently above 50, liquidity is expanding, BTC.D is rolling over, and TOTAL3 has confirmed breakout breadth.",
    pmi: "Above 50 and rising",
    liquidity: "Expanding",
    btcd: "Rolling over",
    total3: "Breakout confirmed",
    allocation: "BTC 25–40% · ETH 20–25% · Alts 35–50% · Cash/Stable 5–15%",
  },
};

function MacroPulseLogo({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 72 72" className="h-full w-auto" fill="none" aria-label="MacroPulse logo mark">
        <defs>
          <linearGradient id="mp-ring" x1="10" y1="60" x2="62" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="mp-blue" x1="35" y1="22" x2="58" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <path d="M13 50a25 25 0 0 1 46-20" stroke="url(#mp-ring)" strokeWidth="8" strokeLinecap="round" />
        <path d="M53 18a25 25 0 0 1 6 31" stroke="url(#mp-blue)" strokeWidth="8" strokeLinecap="round" />
        <path d="M12 50l12-5 7-15 8 24 11-11 10-4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 38l6 1-3 6" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-semibold tracking-tight text-white">Macro</span>
        <span className="text-2xl font-semibold tracking-tight text-orange-400">Pulse</span>
      </div>
    </div>
  );
}

function DialCard() {
  const [state, setState] = useState<keyof typeof dialStates>("btc");
  const current = useMemo(() => dialStates[state], [state]);

  return (
    <Card className="rounded-[2rem] border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
      <CardContent className="p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">MacroPulse Dial</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">{current.label}</div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">{current.summary}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
            Phase: <span className="font-semibold text-white">{current.phase}</span>
            <div className="mt-1">Score: {current.score} · Confidence: {current.confidence}/100</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-12 overflow-hidden rounded-full border border-white/10 bg-neutral-950/80">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#dc2626_0%,#f97316_24%,#eab308_48%,#22c55e_76%,#a855f7_100%)] opacity-85" />
            <motion.div
              className="absolute -top-1 h-14 w-1.5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.8)]"
              animate={{ left: `${current.pointer}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.2em] text-white/45">
            <span>Sell</span>
            <span>Hold</span>
            <span>Buy BTC</span>
            <span>Alt Season</span>
            <span>Top</span>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["PMI", current.pmi],
            ["Liquidity", current.liquidity],
            ["BTC Dominance", current.btcd],
            ["TOTAL3", current.total3],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-neutral-900/70 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</div>
              <div className="mt-2 text-sm font-medium text-white/85">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {Object.entries(dialStates).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setState(key as keyof typeof dialStates)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                state === key
                  ? "border-white/30 bg-white text-neutral-950"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-semibold">{value.label}</div>
              <div className={`mt-1 text-xs ${state === key ? "text-neutral-700" : "text-white/50"}`}>{value.phase}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-white px-5 py-5 text-neutral-950">
          <div className="text-xs uppercase tracking-[0.22em] text-neutral-500">Allocation guidance</div>
          <div className="mt-3 text-base font-medium leading-7">{current.allocation}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs uppercase tracking-[0.28em] text-white/40">{eyebrow}</div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      {body ? <p className="mt-5 text-lg leading-8 text-white/68">{body}</p> : null}
    </div>
  );
}

export default function MacroPulseWebsite() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.13),transparent_22%),radial-gradient(circle_at_top_left,rgba(249,115,22,0.10),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_24%)] pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <MacroPulseLogo className="h-10" />
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-white/65 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden rounded-2xl text-white/80 hover:bg-white/5 hover:text-white md:inline-flex">
              Sign in
            </Button>
            <Button className="rounded-2xl bg-white text-neutral-950 hover:bg-white/90">Subscribe</Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.08fr_0.92fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/55"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Macro-driven crypto intelligence
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
              >
                Crypto explained through the business cycle, not the noise.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-white/70 md:text-xl"
              >
                MacroPulse helps investors understand where we are in the cycle, how liquidity is changing, and whether the market favors buying Bitcoin, holding defensively, rotating into alts, or reducing risk.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button className="rounded-2xl bg-white px-6 py-6 text-base text-neutral-950 hover:bg-white/90">
                  Start with the framework
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-2xl border-white/15 bg-transparent px-6 py-6 text-base text-white hover:bg-white/5 hover:text-white">
                  View sample issue
                </Button>
              </motion.div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {macroCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 + idx * 0.06 }}
                    >
                      <Card className="h-full rounded-[1.75rem] border-white/10 bg-white/5">
                        <CardContent className="p-5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-white/65">{card.body}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              <DialCard />
            </motion.div>
          </div>
        </section>

        <section id="framework" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[0.78fr_1.22fr]">
            <SectionTitle
              eyebrow="Framework"
              title="A repeatable process for understanding crypto through macro."
              body="MacroPulse is designed to reduce complexity. The framework moves from macro conditions to crypto market structure, then converts that into disciplined allocation guidance."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {frameworkSteps.map((item) => (
                <Card key={item.step} className="rounded-[1.75rem] border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">Step {item.step}</div>
                    <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/65">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="dial" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <SectionTitle
              eyebrow="Signature Product"
              title="The MacroPulse Dial"
              body="The dial combines PMI, liquidity, rates, labor, BTC Dominance, and TOTAL3 into a branded market-phase model that tells readers where we are in the cycle and what that implies for crypto risk."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {[
                {
                  title: "Sell / Risk-Off",
                  body: "Used when macro deteriorates, liquidity contracts, and breadth breaks down.",
                  icon: ShieldCheck,
                },
                {
                  title: "Hold / Defensive",
                  body: "Used when the backdrop is mixed and BTC remains the cleaner expression of crypto risk.",
                  icon: Briefcase,
                },
                {
                  title: "Buy Bitcoin",
                  body: "Used when the cycle improves and liquidity turns constructive before broad alt confirmation arrives.",
                  icon: Bitcoin,
                },
                {
                  title: "Alt Season",
                  body: "Only confirmed when PMI is consistently above 50, BTC.D rolls over, and TOTAL3 breaks out.",
                  icon: TrendingUp,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="rounded-[1.75rem] border-white/10 bg-neutral-900/60">
                    <CardContent className="p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/65">{item.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="newsletter" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-[1fr_0.95fr]">
            <Card className="rounded-[2rem] border-white/10 bg-white/5">
              <CardContent className="p-8 md:p-10">
                <SectionTitle
                  eyebrow="Weekly Newsletter"
                  title="What readers get every week"
                  body="Each issue is built to move from market context to action: executive summary, macro dashboard, Bitcoin setup, scenarios, and the latest MacroPulse Dial reading."
                />
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    ["Executive Summary", "The key weekly takeaway in plain English."],
                    ["Market Sentiment", "How risk appetite and positioning are evolving."],
                    ["Business Cycle Framework", "Where the macro regime is shifting and why."],
                    ["Bitcoin Setup", "How BTC is behaving within the current macro context."],
                    ["Bull / Base / Bear", "Three scenario paths for the coming period."],
                    ["Allocation Guidance", "A practical overlay for BTC, ETH, alts, and cash."],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
                      <div className="text-base font-semibold text-white">{title}</div>
                      <p className="mt-2 text-sm leading-7 text-white/65">{body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-white/10 bg-gradient-to-br from-white/8 to-white/3">
              <CardContent className="p-8 md:p-10">
                <div className="text-xs uppercase tracking-[0.28em] text-white/40">Subscribe</div>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">Join the MacroPulse list</h3>
                <p className="mt-4 text-base leading-8 text-white/68">
                  Start with the intro framework and receive weekly macro-led crypto analysis designed for investors who want a repeatable edge.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <Input
                      placeholder="Enter your email"
                      className="h-12 rounded-2xl border-white/10 bg-neutral-950/80 pl-11 text-white placeholder:text-white/35"
                    />
                  </div>
                  <Button className="h-12 w-full rounded-2xl bg-white text-base text-neutral-950 hover:bg-white/90">
                    Subscribe now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-neutral-950/50 p-5">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/40">Includes</div>
                  <div className="mt-4 space-y-3 text-sm text-white/75">
                    <div>• Weekly MacroPulse note</div>
                    <div>• Dial reading and confidence score</div>
                    <div>• BTC vs alt regime context</div>
                    <div>• Macro glossary and framework access</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="glossary" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <SectionTitle
              eyebrow="Glossary"
              title="Core indicators used inside MacroPulse"
              body="Readers should understand what the framework is measuring. These are the recurring indicators that define cycle direction, liquidity conditions, and crypto rotation."
            />
            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-950/70">
              <div className="grid grid-cols-[1.1fr_1.8fr_2fr_1.1fr_0.9fr] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.18em] text-white/40">
                <div>Term</div>
                <div>Meaning</div>
                <div>Importance</div>
                <div>Ticker</div>
                <div>Type</div>
              </div>
              {glossary.map((item) => (
                <div
                  key={item.term}
                  className="grid grid-cols-[1.1fr_1.8fr_2fr_1.1fr_0.9fr] gap-4 border-b border-white/5 px-5 py-5 text-sm last:border-b-0"
                >
                  <div className="font-semibold text-white">{item.term}</div>
                  <div className="leading-7 text-white/68">{item.meaning}</div>
                  <div className="leading-7 text-white/68">{item.importance}</div>
                  <div className="text-white/55">{item.ticker}</div>
                  <div className="text-white/55">{item.type}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle
            eyebrow="Pricing"
            title="Built to evolve from credibility into a product business"
            body="Start with a strong free framework, then convert engaged readers into recurring subscribers through weekly research and premium macro regime work."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pricing.map((tier) => (
              <Card
                key={tier.name}
                className={`rounded-[2rem] border ${tier.featured ? "border-white/30 bg-white text-neutral-950 shadow-2xl shadow-white/10" : "border-white/10 bg-white/5 text-white"}`}
              >
                <CardContent className="p-8">
                  <div className={`text-xs uppercase tracking-[0.24em] ${tier.featured ? "text-neutral-500" : "text-white/40"}`}>
                    {tier.name}
                  </div>
                  <div className="mt-4 text-4xl font-semibold tracking-tight">{tier.price}</div>
                  <p className={`mt-3 text-sm leading-7 ${tier.featured ? "text-neutral-600" : "text-white/65"}`}>{tier.description}</p>
                  <div className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className={`flex items-start gap-3 text-sm ${tier.featured ? "text-neutral-700" : "text-white/78"}`}>
                        <Layers3 className="mt-0.5 h-4 w-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`mt-8 h-12 w-full rounded-2xl ${tier.featured ? "bg-neutral-950 text-white hover:bg-neutral-900" : "bg-white text-neutral-950 hover:bg-white/90"}`}
                  >
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-neutral-950/90">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <MacroPulseLogo className="h-9" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
              MacroPulse explains crypto through the business cycle, liquidity, and market structure — then turns that framework into clear positioning guidance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm text-white/60 md:justify-self-end">
            <div className="space-y-3">
              <div className="font-medium text-white/85">Explore</div>
              <a href="#framework" className="block hover:text-white">Framework</a>
              <a href="#dial" className="block hover:text-white">Dial</a>
              <a href="#newsletter" className="block hover:text-white">Newsletter</a>
            </div>
            <div className="space-y-3">
              <div className="font-medium text-white/85">Company</div>
              <a href="#pricing" className="block hover:text-white">Pricing</a>
              <a href="#glossary" className="block hover:text-white">Glossary</a>
              <a href="#" className="block hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
