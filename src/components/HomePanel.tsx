import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  User, 
  Mail, 
  PlusCircle, 
  CheckCircle, 
  MapPin, 
  Phone, 
  ArrowUpRight, 
  Map, 
  UserPlus, 
  Award, 
  Clock, 
  FileText, 
  RotateCw,
  Eye,
  HandHelping,
  Shield,
  Trash2
} from "lucide-react";
import { UserProfile, Donation, UserRole } from "../types";
import { FoodLinkService } from "../lib/firebase";

interface HomePanelProps {
  user: UserProfile | null;
  donations: Donation[];
  onTabChange: (tab: string) => void;
  onLogin: (profile: UserProfile) => void;
  onToggleUserSession: () => void;
  onCompleteHandover: (donationId: string) => void;
  onClaimListing: (donationId: string) => void;
  onTriggerAuroraSignUp?: () => void;
}

export default function HomePanel({
  user,
  donations,
  onTabChange,
  onLogin,
  onToggleUserSession,
  onCompleteHandover,
  onClaimListing,
  onTriggerAuroraSignUp
}: HomePanelProps) {
  // Login Page States
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpRole, setSignUpRole] = useState<UserRole>("donor");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Login States
  const [useOtpMode, setUseOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [otpSentMessage, setOtpSentMessage] = useState("");

  // Receiver Interactive Map Routing State
  const [activeRoutingDonation, setActiveRoutingDonation] = useState<Donation | null>(null);

  // Compute stats for current donor
  const myDonatedListings = donations.filter((d) => d.donorId === user?.uid);
  const donorAvailableCount = myDonatedListings.filter((d) => d.status === "Available").length;
  const donorReservedCount = myDonatedListings.filter((d) => d.status === "Reserved").length;
  const donorCollectedCount = myDonatedListings.filter((d) => d.status === "Collected").length;
  const totalMealsDonated = myDonatedListings.reduce((sum, d) => sum + (d.aiAnalysis?.estimatedServings || 10), 0);
  const donorCarbonSaved = Math.round(totalMealsDonated * 0.4 * 2.5);

  // Compute stats for current receiver
  const myClaimedListings = donations.filter((d) => d.receiverId === user?.uid);
  const receiverPendingCount = myClaimedListings.filter((d) => d.status === "Reserved").length;
  const receiverCollectedCount = myClaimedListings.filter((d) => d.status === "Collected").length;
  const totalMealsClaimed = myClaimedListings.reduce((sum, d) => sum + (d.aiAnalysis?.estimatedServings || 10), 0);
  const receiverCarbonPrevented = Math.round(totalMealsClaimed * 0.4 * 2.5);

  // Handle Demo Account Seeding
  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      // Simulate database login delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockUid = role === "donor" ? "user-donor-1" : "user-receiver-1";
      const presetName = role === "donor" ? "Gourav Kushwah [Donor]" : "Nourish NGO [Receiver]";
      const email = role === "donor" ? "gourav.kushwah10052007@gmail.com" : "ngo@nourishcommunity.org";
      
      const profile = await FoodLinkService.saveUserProfile(mockUid, presetName, email, role);
      onLogin(profile);
    } catch (e: any) {
      setAuthError("Could not log into demo node profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const profile = await FoodLinkService.signInWithGoogleSecure();
      onLogin(profile);
    } catch (err: any) {
      setAuthError("Google Sign-In simulation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dispatch OTP Verification Code (uses Firebase database state)
  const handleSendOTP = async () => {
    if (!loginEmail || !loginEmail.includes("@")) {
      setAuthError("A valid email address is required to dispatch OTP security keys.");
      return;
    }
    setIsSubmitting(true);
    setAuthError("");
    setOtpSentMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Generate standard 6-digit numeric OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await FoodLinkService.saveOTP(loginEmail, code);
      setOtpSent(true);
      setOtpSentMessage(`🔒 [Firebase OTP Ledger] A secure One-Time Password has been written: "${code}" for email coordinate ${loginEmail.trim().toLowerCase()}. Enter this verification passcode to establish session connection.`);
    } catch (err: any) {
      setAuthError("Failed to route verification OTP keys to global ledger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Manual Form Submission (Sign in or Sign up)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (isSignUp) {
        if (!signUpName || !signUpEmail) {
          setAuthError("Please fill out all required fields.");
          setIsSubmitting(false);
          return;
        }
        const tempUid = "user-" + Math.random().toString(36).substr(2, 9);
        const profile = await FoodLinkService.saveUserProfile(tempUid, signUpName, signUpEmail, signUpRole);
        onLogin(profile);
      } else if (useOtpMode) {
        if (!otpCodeInput) {
          setAuthError("Please enter the 6-digit verification code.");
          setIsSubmitting(false);
          return;
        }
        const isVerified = await FoodLinkService.verifyOTP(loginEmail, otpCodeInput);
        if (!isVerified) {
          setAuthError("Invalid or expired One-Time Passcode.");
          setIsSubmitting(false);
          return;
        }

        // OTP verified successfully! Retrieve existing user profile or initiate default profile
        let profile = await FoodLinkService.findProfileByEmail(loginEmail);
        if (!profile) {
          const autoName = loginEmail.split("@")[0].replace(/[._]/g, " ");
          const formattedName = autoName.charAt(0).toUpperCase() + autoName.slice(1);
          const tempUid = "user-" + Math.random().toString(36).substr(2, 9);
          const isNGO = loginEmail.toLowerCase().includes("ngo") || loginEmail.toLowerCase().includes("receiver");
          const defaultRole: UserRole = isNGO ? "receiver" : "donor";
          
          profile = await FoodLinkService.saveUserProfile(tempUid, formattedName, loginEmail, defaultRole);
        }
        onLogin(profile);
      } else {
        if (!loginEmail) {
          setAuthError("Email address is required.");
          setIsSubmitting(false);
          return;
        }
        // Log in / Register with input email (checks for existing profile first)
        let profile = await FoodLinkService.findProfileByEmail(loginEmail);
        if (!profile) {
          const generatedName = loginEmail.split("@")[0].replace(/[._]/g, " ");
          const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
          const tempUid = "user-" + Math.random().toString(36).substr(2, 9);
          
          let finalRole: UserRole = "donor";
          if (loginEmail.toLowerCase().includes("ngo") || loginEmail.toLowerCase().includes("receiver")) {
            finalRole = "receiver";
          }
          
          profile = await FoodLinkService.saveUserProfile(tempUid, formattedName, loginEmail, finalRole);
        }
        onLogin(profile);
      }
    } catch (e: any) {
      setAuthError("Authentication declined by server guard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-rise">
      {/* Dynamic Welcome Heading and Subheading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            {user ? `${user.role === "donor" ? "Donor" : "Receiver"} Command Station` : "Redistribute Food Surplus with AI"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {user 
              ? `Authorized session for ${user.name}. Track listings, claim metrics, and carbon credits.`
              : "Connecting hospitality restaurants, catering groups, and certified local NGOs to eliminate organic waste."
            }
          </p>
        </div>
        {user && (
          <button
            onClick={onToggleUserSession}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100/80 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-sm"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Switch to {user.role === "donor" ? "Receiver" : "Donor"} Console</span>
          </button>
        )}
      </div>

      {/* ======================= CASE 1: NOT AUTHENTICATED (BEAUTIFUL LOGIN SECURE PAGE) ======================= */}
      {!user && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* Visual Showcase Teaser Column (Left) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 md:p-10 bg-gradient-to-tr from-[#15803d]/15 to-[#0f766e]/5 backdrop-blur-md border border-white/60 rounded-[32px] space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-100/50 border border-emerald-100 px-3 py-1 rounded-full uppercase">
                Google Cloud Grounded AI
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-[#111827] leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                Save Surplus Meals. <br />
                Eliminate Greenhouse Gas Decay.
              </h2>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-xl">
                FoodLink uses advanced Google Gemini AI vision capabilities to inspect surplus restaurant or hotel catering food instantly. No tedious forms: simply drag, drop, confirm safety parameters, and let nearby community kitchens claim the meals in seconds.
              </p>
            </div>

            {/* Quick Demo Launchers to ease verification */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">
                Direct Simulator Node Access (No Password Required)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("donor")}
                  disabled={isSubmitting}
                  className="p-4 rounded-2xl bg-white/50 hover:bg-white/90 border border-white/90 hover:border-emerald-200 text-left transition-all hover:scale-[1.01] shadow-sm flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-gray-800">Demo Donor Account</span>
                    <PlusCircle className="w-4.5 h-4.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Preloaded with 15 listings, baked sourdough entries, and complete carbon projections dashboard tracking.
                  </p>
                  <span className="text-[10.5px] font-semibold text-emerald-700 flex items-center gap-1 mt-1 font-sans">
                    Launch Donor Dashboard <ArrowRight className="w-3" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("receiver")}
                  disabled={isSubmitting}
                  className="p-4 rounded-2xl bg-white/50 hover:bg-white/90 border border-white/90 hover:border-emerald-200 text-left transition-all hover:scale-[1.01] shadow-sm flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-gray-800">Demo Receiver (NGO)</span>
                    <HandHelping className="w-4.5 h-4.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Designed for charities and shelters. Includes claim tools, security verification keys, and interactive route calculators.
                  </p>
                  <span className="text-[10.5px] font-semibold text-teal-700 flex items-center gap-1 mt-1 font-sans">
                    Launch NGO Receiver console <ArrowRight className="w-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Quote of Impact */}
            <div className="pt-4 border-t border-white/50 flex items-center gap-3 text-emerald-800">
              <Award className="w-8 h-8 shrink-0 text-emerald-600" />
              <p className="text-[11px] font-semibold leading-relaxed">
                By redistributing 100 kg of food, you prevent 250 kg of methane decay equivalents from damaging our atmosphere directly.
              </p>
            </div>
          </div>

          {/* Secure Interactive Credentials Portal Column (Right) */}
          <div className="lg:col-span-5 bg-white/35 backdrop-blur-md p-8 rounded-[32px] border border-white/60 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 font-mono">
                  FoodLink Vault Gateway
                </span>
                <h3 className="text-xl font-serif font-extrabold text-[#111827] mt-0.5" style={{ fontFamily: "Georgia, serif" }}>
                  {isSignUp ? "Create Operator Instance" : "Secure Node Authorization"}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  {isSignUp 
                    ? "Enter your details to generate a verified local participant node." 
                    : "Authorize cache session or credentials to link in-memory data states."
                  }
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-600 leading-snug">
                  {authError}
                </div>
              )}

              {otpSentMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl text-[11px] text-emerald-800 leading-snug">
                  {otpSentMessage}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>First & Last Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gourav Kushwah"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/35 text-xs text-[#111827] focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-sm transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Business or Personal Email</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. foodlink@gmail.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/35 text-xs text-[#111827] focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-sm transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700">Designated Operation Role</label>
                      <div className="grid grid-cols-2 gap-3 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setSignUpRole("donor")}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            signUpRole === "donor"
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                              : "border-white/60 bg-white/35 text-gray-600 hover:bg-white/50"
                          }`}
                        >
                          Food Donor (Caterer/Hotel)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignUpRole("receiver")}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            signUpRole === "receiver"
                              ? "bg-[#111827] border-[#111827] text-white shadow-sm"
                              : "border-white/60 bg-white/35 text-gray-600 hover:bg-white/50"
                          }`}
                        >
                          Food Receiver (NGO)
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Session Authentication Mode Selector */}
                    <div className="flex bg-gray-100/80 rounded-xl p-1 mb-4 text-xs border border-gray-200/50">
                      <button
                        type="button"
                        onClick={() => {
                          setUseOtpMode(false);
                          setAuthError("");
                          setOtpSent(false);
                          setOtpSentMessage("");
                        }}
                        className={`flex-1 py-1 px-2.5 rounded-lg font-sans text-center transition-all cursor-pointer ${
                          !useOtpMode 
                            ? "bg-white text-emerald-800 font-bold shadow-sm" 
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        Passcode Access
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUseOtpMode(true);
                          setAuthError("");
                          setOtpSent(false);
                          setOtpSentMessage("");
                        }}
                        className={`flex-1 py-1 px-2.5 rounded-lg font-sans text-center transition-all cursor-pointer ${
                          useOtpMode 
                            ? "bg-white text-emerald-800 font-bold shadow-sm" 
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        One-Time Passcode (OTP)
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>Email address</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. gourav.kushwah10052007@gmail.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/35 text-xs text-[#111827] focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-sm transition-all"
                      />
                    </div>

                    {!useOtpMode ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Safety Access Key</span>
                          </label>
                          <span className="text-[10px] text-gray-400 hover:underline cursor-pointer">
                            Forgot passcode?
                          </span>
                        </div>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/35 text-xs text-[#111827] focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-sm transition-all"
                        />
                      </div>
                    ) : (
                      <>
                        {otpSent && (
                          <div className="space-y-1.5 transition-all duration-300">
                            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                              <span>Dynamic OTP verification code</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="6-digit passcode e.g. 123456"
                              maxLength={6}
                              value={otpCodeInput}
                              onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, ""))}
                              className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/35 text-xs text-[#111827] focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-sm transition-all tracking-widest font-bold"
                            />
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-[10px] text-gray-400 font-sans">Did not receive passcode?</span>
                              <button
                                type="button"
                                onClick={handleSendOTP}
                                className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                              >
                                Trigger New OTP Code
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Submit button depending on standard or OTP Send */}
                {useOtpMode && !otpSent && !isSignUp ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-99 shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Generate & Route Security OTP</span>
                        <ArrowRight className="w-4 h-4 text-emerald-250 animate-pulse" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#111827] hover:bg-black text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-99 shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isSignUp ? "Generate Operator Token" : "Authorize Console Node"}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </>
                    )}
                  </button>
                )}

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200/60 w-full"></div>
                  <span className="absolute px-3 bg-[#F7F9F7] text-[10px] text-gray-400 font-bold uppercase tracking-wider">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
                </button>
              </form>
            </div>

            {/* Toggle switch text link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError("");
                }}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer transition-all inline-flex items-center gap-1"
              >
                {isSignUp ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Already registered? Authorization Console instead</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Deploy raw instance? Register operator profile here</span>
                  </>
                )}
              </button>

              {onTriggerAuroraSignUp && (
                <div className="pt-2 border-t border-dashed border-gray-200/50 mt-2">
                  <button
                    type="button"
                    onClick={onTriggerAuroraSignUp}
                    className="w-full py-2.5 bg-gradient-to-r from-neutral-900 to-black hover:opacity-90 hover:scale-[1.01] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md font-sans"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-305 shrink-0" />
                    <span>Deploy with "Aurora Sign Up"</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sandbox safety seal */}
            <div className="p-3 bg-white/20 rounded-xl border border-white/50 text-[10px] text-gray-500 flex items-start gap-1.5 shadow-inner">
              <Shield className="w-3.5 h-3.5 text-neutral-450 shrink-0 mt-0.5" />
              <span>
                <strong>System Note:</strong> The gateway is fully sync'ed. Enter any email / password passcode to spin up an instant sandboxed profile that runs locally.
              </span>
            </div>
          </div>
        </div>

        {/* Public live surplus broadcast section */}
        <div className="space-y-6 pt-12 border-t border-gray-200/50 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 font-mono">
                Real-Time Cloud Broadcast
              </span>
              <h3 className="text-2xl font-serif font-extrabold text-[#111827] mt-2 block" style={{ fontFamily: "Georgia, serif" }}>
                Live Marketplace Feed (Firebase Stream)
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Monitor active excess food surplus listings across our global ecosystem. Log in to claim or reserve listings.
              </p>
            </div>
            <button
              onClick={() => onTabChange("feed")}
              className="px-5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <span>Explore Marketplace Feed ({donations.length})</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-12 bg-white/45 backdrop-blur-md rounded-3xl border border-white/60">
              <p className="text-xs text-gray-400">Connecting Firestore sync channel... No available listings at this coordinate.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.filter(d => d.status === "Available" || d.status === "Reserved").slice(0, 3).map((don) => (
                <div 
                  key={don.id}
                  className="bg-white/45 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div className="relative h-40 bg-slate-100">
                    {don.imageUrl ? (
                      <img src={don.imageUrl} alt={don.foodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-emerald-600/20" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      don.status === "Available" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : "bg-amber-50 text-amber-800 border border-amber-100"
                    }`}>
                      {don.status}
                    </span>
                    <span className="absolute top-3 right-3 px-3 py-1 text-[10px] font-bold bg-[#111827] dark:text-[#111827] bg-opacity-75 backdrop-blur-sm text-white rounded-full">
                      {don.price && don.price > 0 ? `$${don.price.toFixed(2)}` : "FREE Surplus"}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-gray-400 block tracking-wide uppercase">
                        {don.donorName}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 leading-snug">
                        {don.foodName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 py-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1 leading-tight">{don.pickupAddress}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        window.scrollTo({ top: 180, behavior: "smooth" });
                        setAuthError("🔒 Please complete One-Time OTP or Passcode authorization above to claim active surplus food listings.");
                      }}
                      className="w-full py-2.5 bg-[#111827] hover:bg-black text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>Authorize Instance to Claim</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )}

      {/* ======================= CASE 2: DONOR DASHBOARD (ACTIVE USER) ======================= */}
      {user && user.role === "donor" && (
        <div className="space-y-8 animate-fade-rise">
          {/* Section A: Specific Donor Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Your Total Listings</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {myDonatedListings.length}
                </span>
                <span className="text-[10px] text-emerald-600 block font-bold">
                  {donorAvailableCount} pending, {donorReservedCount} claimed
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Meals Distributed</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {totalMealsDonated}
                </span>
                <span className="text-[10px] text-teal-600 block font-bold">
                  Target: 500 Meals
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Carbon Offset Saved</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {donorCarbonSaved} kg
                </span>
                <span className="text-[10px] text-gray-500 block font-bold">
                  Estimated organic block decay
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Your Leaderboard Rank</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {user.points} pts
                </span>
                <span className="text-[10px] text-emerald-600 block font-bold">
                  Active Badges: {user.badges.slice(0, 1).join("")}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick Actions Console (Left List) */}
            <div className="lg:col-span-4 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Donor Executive Actions</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Operate your listing flow with instant actions</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onTabChange("donate")}
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200/50 flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4.5 h-4.5 text-emerald-300 animate-pulse" />
                    <span>Upload & AI Smart-Check</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onTabChange("feed")}
                  className="w-full p-4 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 hover:border-emerald-200 text-gray-700 font-bold text-xs flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer shadow-sm"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <Eye className="w-4.5 h-4.5 text-gray-400" />
                    <span>Browse Global Excess Feed</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => onTabChange("impact")}
                  className="w-full p-4 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 hover:border-emerald-200 text-gray-700 font-bold text-xs flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer shadow-sm"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-500 animate-bounce" />
                    <span>Simulate Projections model</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              {/* Verified Badge Board */}
              <div className="pt-4 border-t border-white/55 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Awarded Badges</span>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] px-3 py-1 font-semibold rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{b}</span>
                    </span>
                  ))}
                  {user.badges.length === 0 && (
                    <span className="text-[10px] text-gray-400 italic">No achievements unlocked yet. Post first surplus item to earn points.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Donations Management Console (Right List) */}
            <div className="lg:col-span-8 bg-white/45 backdrop-blur-md p-8 rounded-[32px] border border-white/65 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5 font-sans">
                    <Clock className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Your Dedicated Food Listings</span>
                  </h3>
                  <p className="text-xs text-gray-500">Track claim statuses and sign off handovers instantly</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-white/50 border border-white/60 rounded-full text-gray-500 font-mono">
                  {myDonatedListings.length} Total
                </span>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {myDonatedListings.length === 0 ? (
                  <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 space-y-2 mt-2">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto animate-pulse" />
                    <p className="text-xs font-semibold text-gray-800">You haven't listed any surplus item yet</p>
                    <p className="text-[10.5px] text-gray-500 max-w-sm mx-auto">Click "Upload & AI Smart-Check" to utilize Gemini Vision models and list your food waste.</p>
                  </div>
                ) : (
                  myDonatedListings.map((don) => (
                    <div
                      key={don.id}
                      className="p-4 rounded-2xl bg-white/45 border border-white/65 hover:bg-white/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1 sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            don.status === "Available" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                              : don.status === "Reserved" 
                              ? "bg-amber-50 text-amber-800 border-amber-100 animate-pulse" 
                              : "bg-neutral-100 text-neutral-800 border-neutral-200"
                          }`}>
                            {don.status}
                          </span>
                          <span className="text-[10px] text-gray-450 font-mono">ID: {don.id}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-800">{don.foodName}</h4>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-semibold">
                          <span>Quantity: {don.quantity}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span className="truncate max-w-[150px]">{don.pickupAddress}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status / Handover trigger */}
                      <div className="shrink-0">
                        {don.status === "Available" && (
                          <div className="p-2 text-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg whitespace-nowrap">
                            Available Online
                          </div>
                        )}
                        {don.status === "Reserved" && (
                          <button
                            type="button"
                            onClick={() => onCompleteHandover(don.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                            <span>Mark Complete Handover</span>
                          </button>
                        )}
                        {don.status === "Collected" && (
                          <div className="p-2 text-center text-[10px] font-bold text-gray-450 bg-white/40 rounded-lg flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-550" />
                            <span>Successfully Handed over</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= CASE 3: RECEIVER DASHBOARD (ACTIVE USER) ======================= */}
      {user && user.role === "receiver" && (
        <div className="space-y-8 animate-fade-rise">
          {/* Section A: Specific Receiver Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Your Picked Up Meals</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {totalMealsClaimed}
                </span>
                <span className="text-[10px] text-emerald-600 block font-bold">
                  {receiverPendingCount} active pickup missions pending
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">CO₂ Prevented Decay</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {receiverCarbonPrevented} kg
                </span>
                <span className="text-[10px] text-teal-600 block font-bold">
                  Atmospheric methane equivalent offset
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Authorized Token status</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans flex items-center gap-1.5 leading-none">
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full inline-block animate-ping" />
                  <span className="text-2xl font-bold">Verified</span>
                </span>
                <span className="text-[10px] text-emerald-700 block font-semibold">
                  Approved operator authority
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-[32px] flex items-center justify-between shadow-md hover:scale-[1.01] transition-transform duration-300">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 block font-semibold">Total Points Earned</span>
                <span className="text-3xl font-extrabold text-[#111827] font-sans">
                  {user.points} pts
                </span>
                <span className="text-[10px] text-emerald-600 block font-bold">
                  Achievements: {user.badges.slice(0, 1).join("")}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick Actions Console (Left List) */}
            <div className="lg:col-span-4 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/60 shadow-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Receiver Executive Actions</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Operate your logistics claim queue easily</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => onTabChange("feed")}
                  className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200/50 flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4.5 h-4.5 text-emerald-300 animate-pulse" />
                    <span>Search Active Marketplace</span>
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onTabChange("leaderboard")}
                  className="w-full p-4 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 hover:border-emerald-200 text-gray-700 font-bold text-xs flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer shadow-sm"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <Award className="w-4.5 h-4.5 text-gray-400 animate-bounce" />
                    <span>View Leaderboard stand</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => onTabChange("impact")}
                  className="w-full p-4 rounded-2xl bg-white/60 hover:bg-white/95 border border-white/80 hover:border-emerald-200 text-gray-700 font-bold text-xs flex items-center justify-between transition-all hover:scale-[1.01] active:scale-99 cursor-pointer shadow-sm"
                >
                  <span className="flex items-center gap-2 text-gray-800">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
                    <span>Environmental offset stats</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              {/* Verified Badge Board */}
              <div className="pt-4 border-t border-white/55 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Receiver Achievements</span>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((b) => (
                    <span
                      key={b}
                      className="text-[10px] px-3 py-1 font-semibold rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Claimed/Reserved Pickup Missions Console (Right List) */}
            <div className="lg:col-span-8 bg-white/45 backdrop-blur-md p-8 rounded-[32px] border border-white/65 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5 font-sans">
                    <Clock className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Your Active Claims & Pickups</span>
                  </h3>
                  <p className="text-xs text-gray-500">Provide the claim ticket info at restaurants upon arrival</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-white/50 border border-white/60 rounded-full text-gray-500 font-mono">
                  {myClaimedListings.length} Active
                </span>
              </div>

              {/* Active routing map simulation */}
              {activeRoutingDonation && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl animate-fade-rise space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-emerald-800 uppercase flex items-center gap-1 font-mono">
                      <Map className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>Gemini Optimized Redistribution Guide</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveRoutingDonation(null)}
                      className="text-[10px] text-gray-400 hover:text-black hover:underline cursor-pointer font-bold"
                    >
                      Deactivate Route
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-650 leading-relaxed">
                    <strong>Optimal Strategy:</strong> Dispatch courier immediately to <strong>{activeRoutingDonation.pickupAddress}</strong>. Recommended route via North bypass avoids morning backlog. Pack in insulated dry thermal bags under temperature control.
                  </p>
                  <p className="text-[10px] text-emerald-800 italic">
                    Safety Warning: Expiring in {Math.round((new Date(activeRoutingDonation.expiryTime).getTime() - Date.now()) / 3600000)} hours.
                  </p>
                </div>
              )}

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {myClaimedListings.length === 0 ? (
                  <div className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/50 space-y-2 mt-2">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto animate-pulse" />
                    <p className="text-xs font-semibold text-gray-800">No active claimed food item is here</p>
                    <p className="text-[10.5px] text-gray-500 max-w-sm mx-auto">Browse the "Active Surplus Marketplace" tab, find available restaurant foods, and tap "Claim Food" to pick it up.</p>
                  </div>
                ) : (
                  myClaimedListings.map((don) => (
                    <div
                      key={don.id}
                      className="p-5 rounded-2xl bg-white/45 border border-white/65 hover:bg-white/60 transition-all space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/40 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 px-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              Claim Code: #FL-{don.id.substring(4, 8).toUpperCase() || "7749"}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              don.status === "Reserved" 
                                ? "bg-amber-50 text-amber-800 border-amber-100 animate-pulse" 
                                : "bg-neutral-100 text-neutral-800 border-neutral-200"
                            }`}>
                              {don.status}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-800 mt-1">{don.foodName}</h4>
                        </div>
                        <span className="text-[10.5px] font-semibold text-emerald-800">
                          {don.donorName || "Savory Bistro"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Pickup location contact:</span>
                          </div>
                          <p className="font-semibold text-gray-800 pl-4">{don.pickupAddress}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Authorized contact:</span>
                          </div>
                          <p className="font-semibold text-gray-800 pl-4">{don.contactNumber}</p>
                        </div>
                      </div>

                      {/* Visual QR claim pass mock */}
                      {don.status === "Reserved" && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-neutral-900/95 backdrop-blur-md rounded-2xl text-white border border-white/10 shadow-md">
                          <div className="flex items-center gap-3">
                            {/* Visual dummy Qr code placeholder inside theme */}
                            <div className="w-10 h-10 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-[#111827] rounded flex items-center justify-center text-[8px] font-bold text-white tracking-widest font-mono">
                                #FL
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">NGO Digital Pickup Pass</span>
                              <p className="text-[11px] text-gray-300">Show this QR ticket at the establishment counter upon arrival.</p>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveRoutingDonation(don)}
                              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/35 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <Map className="w-3 h-3 text-emerald-300" />
                              <span>Route Planner</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onCompleteHandover(don.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Confirm Collected</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {don.status === "Collected" && (
                        <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <p className="text-xs font-semibold">Collected successfully — Saved {don.aiAnalysis ? don.aiAnalysis.carbonFootprintSaved : "8"} kg of equivalent organic emissions!</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
