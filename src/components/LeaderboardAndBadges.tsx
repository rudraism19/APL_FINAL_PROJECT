import { LeaderboardEntry } from "../types";
import { Award, Zap, Heart, Trophy, Clock, ArrowUpRight } from "lucide-react";

interface LeaderboardAndBadgesProps {
  entries: LeaderboardEntry[];
  recentClaimsCount: number;
}

export default function LeaderboardAndBadges({ entries, recentClaimsCount }: LeaderboardAndBadgesProps) {
  // Hardcoded illustrative activity items to keep a cinematic hackathon feel
  const activityTicker = [
    { text: "Green Gourmet listed 15 Servings of organic salad boxes", time: "18m ago", type: "list" },
    { text: "Nourish NGO claimed Mozzarella Tomato Paninis", time: "42m ago", type: "claim" },
    { text: "Wild Yeasts Bakery gained 50 Points from smart descriptions!", time: "1h ago", type: "points" },
    { text: "Handover completed for curry pots successfully", time: "2h ago", type: "collect" },
  ];

  const getRankBadgeColor = (idx: number) => {
    switch (idx) {
      case 0:
        return "bg-amber-100/70 text-amber-950 border-amber-300 shadow-inner";
      case 1:
        return "bg-slate-200/60 text-slate-950 border-slate-350 shadow-inner";
      case 2:
        return "bg-orange-100/75 text-orange-950 border-orange-300 shadow-inner";
      default:
        return "bg-white/45 text-gray-700 border-white/60 shadow-inner";
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "Impact Champion":
        return "bg-purple-100/60 text-purple-900 border-purple-200/80 hover:bg-purple-200";
      case "Community Saver":
        return "bg-sky-100/60 text-sky-900 border-sky-200/80 hover:bg-sky-200";
      case "Food Hero":
        return "bg-emerald-100/60 text-emerald-900 border-emerald-200/80 hover:bg-emerald-200";
      default:
        return "bg-white/40 text-gray-800 border-white/50";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-6">
      
      {/* Col 1 & 2: Leaderboard */}
      <div className="md:col-span-2 glass-panel p-8 rounded-[32px] space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-1.5 font-sans">
              <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
              <span>We-Rescue Leaderboard</span>
            </h3>
            <p className="text-xs text-gray-500">Weekly stand standings representing active food redistribute contributions</p>
          </div>
          <span className="text-[10px] bg-white/40 border border-white/60 px-2.5 py-1 rounded-full text-gray-600 font-mono tracking-tight backdrop-blur-sm">
            Hackathon Mode
          </span>
        </div>

        <div className="space-y-3.5 pt-2">
          {entries.map((entry, idx) => (
            <div
              key={entry.uid}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/70 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4">
                {/* Ranking Position Badge */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold leading-none shrink-0 ${getRankBadgeColor(idx)}`}>
                  {idx + 1}
                </div>

                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <span>{entry.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-white/40 border border-white/50 text-gray-500 max-h-4 leading-none">
                      {entry.role}
                    </span>
                  </span>
                  
                  {/* Badges Container */}
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {entry.badges.map((b) => (
                      <span
                        key={b}
                        className={`text-[9.5px] px-2 py-0.5 rounded-full font-semibold transition-all border ${getBadgeStyle(b)}`}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accumulate Points */}
              <div className="text-right">
                <span className="text-sm font-bold text-[#111827] flex items-center justify-end gap-1 font-mono">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{entry.points}</span>
                </span>
                <span className="text-[9px] text-gray-400 block tracking-wider uppercase font-semibold">RESCUE POINTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Live Activity / Hackathon Tracker */}
      <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between shadow-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-1.5 font-sans">
              <Clock className="w-5 h-5 text-emerald-500 animate-pulse" />
              <span>Live Redistribution logs</span>
            </h3>
            <p className="text-xs text-gray-500">Transactional status entries across the network</p>
          </div>

          <div className="space-y-3 pt-2">
            {activityTicker.map((act, i) => (
              <div
                key={i}
                className="p-3.5 bg-white/35 backdrop-blur-sm rounded-2xl border border-white/55 flex items-start gap-2.5 hover:translate-x-1 hover:bg-white/55 transition-all shadow-sm"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0 animate-ping" />
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-800 leading-snug font-medium">{act.text}</p>
                  <span className="text-[10px] text-gray-400 font-mono block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small motivational quote */}
        <div className="p-4 bg-emerald-50/45 text-emerald-800 rounded-2xl flex items-center gap-3 border border-emerald-100/60 mt-6 md:mt-2 shadow-sm backdrop-blur-md">
          <Heart className="w-6 h-6 text-emerald-600 animate-pulse shrink-0" />
          <p className="text-[10px] sm:text-xs leading-relaxed font-semibold">
            Every listing verified with Gemini reduces co2 decay by 2.5 kg. Together, we feed communities.
          </p>
        </div>
      </div>

    </div>
  );
}
