import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CinematicHero from "./components/CinematicHero";
import AIDonationWizard from "./components/AIDonationWizard";
import DonationFeed from "./components/DonationFeed";
import ImpactAnalytics from "./components/ImpactAnalytics";
import LeaderboardAndBadges from "./components/LeaderboardAndBadges";
import HomePanel from "./components/HomePanel";
import PricingPanel from "./components/PricingPanel";
import AuroraSignUp from "./components/AuroraSignUp";
import { UserProfile, Donation, AppNotification, UserRole } from "./types";
import { FoodLinkService } from "./lib/firebase";
import { Sparkles, X, UserCheck, Bell, Shield } from "lucide-react";

export default function App() {
  // Navigation & Screen Modes
  const [cinematicMode, setCinematicMode] = useState(true);
  const [currentTab, setCurrentTab] = useState("home");

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showAuroraRegister, setShowAuroraRegister] = useState(false);
  const [authError, setAuthError] = useState("");

  // Core Data Lists
  const [donations, setDonations] = useState<Donation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Real-time toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // 1. Initial State Auto-Login
  useEffect(() => {
    // Attempt load cached user session if any
    const cachedUid = localStorage.getItem("foodlink_active_uid");
    if (cachedUid) {
      FoodLinkService.getUserProfile(cachedUid).then((profile) => {
        if (profile) {
          setUser(profile);
          triggerToast(`Welcome back, ${profile.name}! Console loaded successfully`, "info");
        }
      });
    }

    // Subscribe to real-time donation updates
    const unsubscribeDonations = FoodLinkService.subscribeDonations((newList) => {
      setDonations(newList);
    });

    return () => {
      unsubscribeDonations();
    };
  }, []);

  // 2. Notification live polling
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const unsubscribeNotifications = FoodLinkService.subscribeNotifications(user.uid, (data) => {
      setNotifications(data);
    });

    return () => {
      unsubscribeNotifications();
    };
  }, [user]);

  // Auth: Trigger Secure sign-in simulations
  const handleSignIn = async () => {
    try {
      setAuthError("");
      const profile = await FoodLinkService.signInWithGoogleSecure();
      setUser(profile);
      localStorage.setItem("foodlink_active_uid", profile.uid);
      triggerToast(`Successfully authenticated as ${profile.name}!`, "success");
      setShowRoleSelector(false);
    } catch (e: any) {
      setAuthError("Simulation authorization failed. Verify connection variables.");
    }
  };

  const handleHomeLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem("foodlink_active_uid", profile.uid);
    triggerToast(`Welcome to your workspace dashboard, ${profile.name}!`, "success");
    setCurrentTab("home");
  };

  // Toggle user role (Donor <-> Receiver console dashboards)
  const handleToggleUserRole = async () => {
    if (!user) return;
    const nextRole: UserRole = user.role === "donor" ? "receiver" : "donor";
    const updated = await FoodLinkService.saveUserProfile(user.uid, user.name, user.email, nextRole);
    setUser(updated);
    
    // Auto shift tabs to represent valid views
    if (nextRole === "receiver" && currentTab === "donate") {
      setCurrentTab("feed");
    }

    triggerToast(`Switched console viewpoint to ${nextRole.toUpperCase()} console`, "info");
  };

  // Handles manual Sign-out
  const handleSignOut = async () => {
    await FoodLinkService.signOut();
    localStorage.removeItem("foodlink_active_uid");
    setUser(null);
    setCurrentTab("feed");
    triggerToast("Signed out of console node safely", "info");
  };

  // Action: Create active listing handler
  const handleDonationPublishSuccess = (newListing: Donation) => {
    triggerToast(`Congratulations! '${newListing.foodName}' is live for local NGO claims`, "success");
    setCurrentTab("feed"); // Redirect to listings feed
  };

  // Action: CLAIMing an available surplus listing
  const handleClaimListing = async (donationId: string) => {
    if (!user) {
      setShowRoleSelector(true);
      return;
    }

    const success = await FoodLinkService.claimDonation(donationId, user.uid, user.name);
    if (success) {
      triggerToast("Food donation successfully claimed! Pickup guidelines generated", "success");
    } else {
      triggerToast("Claim unsuccessful. Item may be claimed or under safety review", "info");
    }
  };

  // Action: Handover completion logging
  const handleCompleteHandover = async (donationId: string) => {
    if (!user) return;
    const success = await FoodLinkService.completeHandover(donationId, user.uid);
    if (success) {
      triggerToast("Ecosystem Handover Complete! Positive environmental offset calculated", "success");
    } else {
      triggerToast("Transaction completion not supported", "info");
    }
  };

  // Compute live aggregations for display
  const currentEcosystemImpact = FoodLinkService.getEcosystemImpactStats();
  const currentLeaderboard = FoodLinkService.getLeaderboard();

  if (showAuroraRegister) {
    const handleRegisterSuccess = async (newUser: { firstName: string; lastName: string; email: string }) => {
      // Create actual simulated user profile on FoodLink
      const fullName = `${newUser.firstName} ${newUser.lastName}`;
      const role: UserRole = "receiver"; // default starting role
      const profile = await FoodLinkService.saveUserProfile(
        "usr-" + Math.random().toString(36).substr(2, 9),
        fullName,
        newUser.email,
        role
      );
      setUser(profile);
      localStorage.setItem("foodlink_active_uid", profile.uid);
      setShowAuroraRegister(false);
      triggerToast(`Account created via Aurora! Welcome, ${fullName}!`, "success");
    };

    return (
      <AuroraSignUp
        onRegisterSuccess={handleRegisterSuccess}
        onCancel={() => setShowAuroraRegister(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F9F7] text-[#111827] flex flex-col font-sans overflow-hidden">
      
      {/* Ambient background glows for Frosted Glass Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-50/70 rounded-full blur-[110px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Toast Feedback Alerts overlay */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel-dark text-white border border-neutral-700 max-w-sm flex items-center gap-3 shadow-2xl animate-fade-rise">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shrink-0" />
            <p className="text-xs leading-relaxed font-semibold">{toast.message}</p>
          </div>
        )}

        {/* RENDER MODE A: Cinematic Hero viewport */}
        {cinematicMode ? (
          <CinematicHero onBegin={() => setCinematicMode(false)} />
        ) : (
          
          /* RENDER MODE B: Fulfilled Ecosystem Applet Interactive Workspace */
          <div className="flex flex-col min-h-screen animate-fade-rise">
            
            {/* Header Navigation */}
            <Navbar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            user={user}
            onToggleUserSession={handleToggleUserRole}
            onSignOut={handleSignOut}
            notificationCount={notifications.filter(n => !n.read).length}
            onToggleNotifications={() => setShowNotificationPanel(!showNotificationPanel)}
          />

          {/* Interactive Workspace Container */}
          <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 md:py-12 space-y-10">

            {/* Dynamic Interactive notifications sidebar overlay */}
            {showNotificationPanel && (
              <div className="glass-panel p-6 rounded-[32px] space-y-4 animate-fade-rise max-w-lg mx-auto shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/40">
                  <span className="text-xs font-bold font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-550" />
                    <span>Real-Time Alerts ({notifications.length})</span>
                  </span>
                  <button
                    onClick={() => setShowNotificationPanel(false)}
                    className="p-1 rounded-lg hover:bg-white/30 text-neutral-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3.5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No active notifications</p>
                  ) : (
                    notifications.map((not) => (
                      <div 
                        key={not.id}
                        className="p-3.5 bg-white/35 backdrop-blur-sm rounded-2xl border border-white/55 flex justify-between items-start shadow-sm"
                      >
                        <p className="text-xs text-neutral-800 leading-snug font-medium pr-4">{not.message}</p>
                        <button
                          onClick={() => FoodLinkService.deleteNotification(not.id)}
                          className="text-[10px] text-gray-400 font-bold hover:text-red-700 cursor-pointer transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Render Context View */}
            
            {/* 0. Home Interactive Dashboard / Login Portal */}
            {currentTab === "home" && (
              <HomePanel
                user={user}
                donations={donations}
                onTabChange={setCurrentTab}
                onLogin={handleHomeLogin}
                onToggleUserSession={handleToggleUserRole}
                onCompleteHandover={handleCompleteHandover}
                onClaimListing={handleClaimListing}
                onTriggerAuroraSignUp={() => setShowAuroraRegister(true)}
              />
            )}
            
            {/* 1. Listings Feed / Marketplace */}
            {currentTab === "feed" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                    Active Surplus Marketplace
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Real-time available surplus listings verified using Google Gemini AI vision checks. Claim items with one wave.
                  </p>
                </div>

                <DonationFeed
                  donations={donations}
                  currentUserUid={user?.uid || ""}
                  currentUserRole={user?.role || "receiver"}
                  currentUserName={user?.name || "Anonymous Member"}
                  onClaim={handleClaimListing}
                  onComplete={handleCompleteHandover}
                />
              </div>
            )}

            {/* 2. List Food Surplus Wizard (Donor Console only) */}
            {currentTab === "donate" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                    List Food Surplus
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Upload photo of over-orders or surplus catering. Our custom Gemini AI will check portions & compose smart copy.
                  </p>
                </div>

                {user ? (
                  <AIDonationWizard
                    donorId={user.uid}
                    donorName={user.name}
                    onSuccess={handleDonationPublishSuccess}
                  />
                ) : (
                  <div className="p-12 text-center bg-white/30 backdrop-blur-md rounded-[32px] border border-white/50 max-w-md mx-auto space-y-4 shadow-xl">
                    <p className="text-sm font-semibold text-neutral-800">Please establish your playground session profile first</p>
                    <button
                      onClick={() => setShowRoleSelector(true)}
                      className="px-6 py-2.5 bg-neutral-900 hover:bg-[#111827] hover:scale-[1.01] text-white rounded-full text-xs font-bold cursor-pointer transition-all hover:scale-102"
                    >
                      Sign In Preset
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Impact Projections Dashboard */}
            {currentTab === "impact" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                    Environmental Offset Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Ecosystem aggregate environmental stats representing carbon metrics saved and equivalents prevents.
                  </p>
                </div>

                <ImpactAnalytics
                  stats={currentEcosystemImpact}
                  totalDonationCount={donations.length}
                />
              </div>
            )}

            {/* 3.5 Pricing Tiers Panel */}
            {currentTab === "pricing" && (
              <PricingPanel />
            )}

            {/* 4. Gamified Leaderboard */}
            {currentTab === "leaderboard" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
                    Eco-Champions Leaders
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Accumulate points through Listings (50 pts), descriptive accuracy (50 pts), or collection logs (75 pts).
                  </p>
                </div>

                <LeaderboardAndBadges
                  entries={currentLeaderboard}
                  recentClaimsCount={donations.filter(d => d.status === "Collected").length}
                />
              </div>
            )}

          </main>

          {/* Footer branding */}
          <footer className="border-t border-white/40 py-10 bg-white/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-550">
              <div className="flex items-center gap-1.5 text-neutral-800">
                <span className="font-serif text-black font-semibold text-sm">FoodLink</span>
                <sup className="top-[-0.3em] font-sans">®</sup>
                <span className="ml-1 opacity-75">— Zero Waste Solutions</span>
              </div>
              <p className="font-sans">
                Powered by Gemini 3.5 & Google Cloud. Zero organic waste decay equivalent.
              </p>
            </div>
          </footer>

          {/* Secure Role SignIn Selector Modal Overlay */}
          {showRoleSelector && (
            <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-8 max-w-sm w-full border border-white/85 shadow-2xl space-y-6 animate-fade-rise">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">
                      Authorise Node
                    </span>
                    <h3 className="text-lg font-serif font-bold text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>
                      Sign In FoodLink AI
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowRoleSelector(false)}
                    className="p-1 rounded-lg hover:bg-white/45 text-neutral-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#6F6F6F] leading-relaxed">
                  Join other active hospitality restaurants, hotel groups, and NGO shelters in distributing food waste. Click secure simulation below:
                </p>

                {authError && <p className="text-xs text-red-600">{authError}</p>}

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleSignIn}
                    className="w-full py-3.5 bg-neutral-900 hover:bg-[#111827] hover:scale-[1.01] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Authorize Preset Session</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowRoleSelector(false);
                      setShowAuroraRegister(true);
                    }}
                    className="w-full py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <span>Create Profile (Aurora Sign Up)</span>
                  </button>

                  <div className="p-3 bg-white/40 backdrop-blur-sm rounded-xl flex gap-1.5 items-start text-[10px] text-gray-500 leading-normal border border-white/60 shadow-inner">
                    <Shield className="w-4 h-4 text-neutral-450 shrink-0 mt-0.5" />
                    <span>Uses sandboxed in-memory authentication states so compiling works offline perfectly.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
      </div>
    </div>
  );
}
