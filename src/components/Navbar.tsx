import { UserProfile } from "../types";
import { User, Bell, Milestone, LogOut, RefreshCw, Zap } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile | null;
  onToggleUserSession: () => void;
  onSignOut: () => void;
  notificationCount: number;
  onToggleNotifications: () => void;
}

export default function Navbar({
  currentTab,
  onTabChange,
  user,
  onToggleUserSession,
  onSignOut,
  notificationCount,
  onToggleNotifications
}: NavbarProps) {
  return (
    <header className="border-b border-white/45 bg-white/35 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3.5 sm:py-4">
        
        {/* Brand trademark header logo */}
        <button 
          onClick={() => onTabChange("home")}
          className="text-xl sm:text-2xl font-serif text-[#111827] tracking-tight flex items-center gap-2 focus:outline-none cursor-pointer"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0 transform hover:rotate-12 transition-transform duration-300">
            <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="font-bold">FoodLink AI</span>
          <sup className="text-[10px] font-sans text-gray-400 font-normal top-[-0.6em]">®</sup>
        </button>

        {/* Tab Links */}
        <nav className="hidden md:flex items-center gap-2.5 text-xs font-semibold bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-sm">
          <button
            onClick={() => onTabChange("home")}
            className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
              currentTab === "home" 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                : "text-gray-500 hover:text-black hover:bg-white/40"
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => onTabChange("feed")}
            className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
              currentTab === "feed" 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                : "text-gray-500 hover:text-black hover:bg-white/40"
            }`}
          >
            Marketplace
          </button>

          {user && user.role === "donor" && (
            <button
              onClick={() => onTabChange("donate")}
              className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
                currentTab === "donate" 
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                  : "text-gray-500 hover:text-black hover:bg-white/40"
              }`}
            >
              List Surplus
            </button>
          )}

          <button
            onClick={() => onTabChange("impact")}
            className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
              currentTab === "impact" 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                : "text-gray-500 hover:text-black hover:bg-white/40"
            }`}
          >
            Impact
          </button>

          <button
            onClick={() => onTabChange("pricing")}
            className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
              currentTab === "pricing" 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                : "text-gray-500 hover:text-black hover:bg-white/40"
            }`}
          >
            Pricing
          </button>

          <button
            onClick={() => onTabChange("leaderboard")}
            className={`transition-all duration-300 px-4 py-1.5 rounded-full cursor-pointer font-sans ${
              currentTab === "leaderboard" 
                ? "bg-white text-emerald-700 shadow-sm border border-emerald-50/50" 
                : "text-gray-500 hover:text-black hover:bg-white/40"
            }`}
          >
            Leaderboards
          </button>
        </nav>

        {/* Session Actions and Role Indicators */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification bubble */}
              <button
                onClick={onToggleNotifications}
                className="relative p-2 rounded-xl bg-white/40 hover:bg-white/80 border border-white/60 cursor-pointer text-gray-600 hover:text-[#111827] transition-all shadow-sm"
                title="Ecosystem alerts"
              >
                <Bell className="w-4.5 h-4.5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 border border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Point indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/60 border border-white/70 rounded-xl shadow-sm backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span className="text-xs font-bold text-amber-800 font-mono">
                  {user.points}
                </span>
              </div>

              {/* Profile Block */}
              <div className="flex items-center gap-2 pl-3 border-l border-white/40">
                <div className="text-right hidden lg:block space-y-0.5 mr-1">
                  <span className="text-xs font-bold text-gray-800 block leading-none">{user.name}</span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block">
                    {user.role} console
                  </span>
                </div>

                {/* Role Switcher toggles */}
                <button
                  onClick={onToggleUserSession}
                  className="p-2 rounded-xl bg-white/40 hover:bg-white/80 border border-white/60 cursor-pointer text-gray-500 hover:text-emerald-600 transition-all shadow-sm"
                  title="Toggle console view role"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl bg-white/40 hover:bg-rose-50 border border-white/60 hover:border-rose-100 hover:text-[#e11d48] text-gray-500 cursor-pointer transition-all shadow-sm"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onToggleUserSession}
              className="rounded-full px-6 py-2.5 bg-[#111827] hover:bg-neutral-800 font-semibold text-xs text-white hover:scale-105 transition-all cursor-pointer shadow-sm"
            >
              Begin Journey
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
