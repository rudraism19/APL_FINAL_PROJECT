import React from "react";
import { Check, ShieldCheck, Zap, Sparkles, Building, Flame } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  badge?: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export default function PricingPanel() {
  const plans: PricingPlan[] = [
    {
      name: "Ecosystem Partner",
      price: "$0",
      period: "forever",
      description: "Dedicated access for verified NGOs, local soup kitchens, and individual volunteers.",
      features: [
        "Unlimited free surplus food claims",
        "Gemini AI freshness vision auditor",
        "Direct venue route coordinates",
        "Volunteer safety training materials",
        "Ecosystem offset impact reports"
      ],
      cta: "Activate Free NGO Station",
      icon: <Building className="w-5 h-5 text-emerald-500" />
    },
    {
      name: "Bistro & Caterer",
      price: "$19",
      period: "per month",
      description: "Great for individual bakeries, local bistros, and small wedding/party event caterers.",
      features: [
        "Sell surplus food at low prices",
        "Unlimited listings per month",
        "AI Auto-Write smart descriptions",
        "Secure Credit Escrow protection",
        "Standard carbon reduction analytics",
        "Priority volunteer collection alerts"
      ],
      cta: "Upgrade to Bistro Node",
      badge: "Most Popular",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      popular: true
    },
    {
      name: "Banquet & Grand Hotel",
      price: "$49",
      period: "per month",
      description: "Constructed for five-star luxury hotels, major ballroom events, and convention centers.",
      features: [
        "Sell banquet size surpluses ($50-$200 cover)",
        "Premium verified Gemini Vision auditor",
        "Zero payment commission on sales",
        "Advanced ESG carbon offset exports",
        "Multi-admin console viewpoints",
        "Instant broadcast to top-tier NGOs"
      ],
      cta: "Connect Hotel Workspace",
      icon: <Flame className="w-5 h-5 text-rose-500" />
    }
  ];

  return (
    <div className="space-y-10 py-4 animate-fade-rise">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm inline-block">
          Ecosystem Sustainability Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
          Simple Tiers to End Food Waste
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
          NGOs always claim free surplus at zero charge. Hotels and caterers can subscribe to sell high-volume leftovers at low cost to cover base packaging expenses.
        </p>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative group rounded-[32px] overflow-hidden flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? "bg-white/70 border-2 border-emerald-400 p-8 shadow-xl shadow-emerald-100/40 -translate-y-1"
                : "bg-white/45 border border-white/65 p-7 hover:bg-white/65 shadow-md hover:shadow-xl"
            }`}
          >
            {/* Most popular indicator badge */}
            {plan.badge && (
              <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {plan.badge}
              </span>
            )}

            <div className="space-y-6">
              {/* Header block */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-[#E5E7EB] shrink-0">
                    {plan.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#111827] font-sans uppercase tracking-wider">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 pt-3">
                  <span className="text-4xl font-bold text-neutral-900 font-sans tracking-tight">{plan.price}</span>
                  <span className="text-xs text-gray-500 font-sans">/ {plan.period}</span>
                </div>

                <p className="text-xs text-gray-500 leading-normal font-sans pt-1">
                  {plan.description}
                </p>
              </div>

              {/* Pricing Features */}
              <div className="border-t border-dashed border-gray-200/60 pt-5 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">What's Included:</span>
                <ul className="space-y-2.5 text-xs">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-neutral-700 font-sans leading-normal">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Call to action button */}
            <div className="pt-8">
              <button
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-300 block text-center cursor-pointer ${
                  plan.popular
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200"
                    : "bg-[#111827] hover:bg-black text-white hover:scale-[1.01]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow assurance micro panel */}
      <div className="glass-panel p-6 rounded-[28px] max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border border-white/80 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-150 flex items-center justify-center shrink-0 text-emerald-700">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">
            100% Secure Food Transfer & Authorization System
          </h4>
          <p className="text-[11px] text-gray-500 leading-normal font-sans">
            Our micro Escrow model holds low-pricing funds securely until receivers confirm successful pickup, protecting donors from false claims and ensuring quality meals safely reach families in need.
          </p>
        </div>
      </div>
    </div>
  );
}
