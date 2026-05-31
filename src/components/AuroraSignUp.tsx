import React, { useState } from "react";
import { motion } from "motion/react";
import { Circle, Chrome, Github, Eye, EyeOff, Check, X } from "lucide-react";

interface AuroraSignUpProps {
  onRegisterSuccess: (newUser: { firstName: string; lastName: string; email: string }) => void;
  onCancel: () => void;
}

// 1. Reusable StepItem Component
interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

const StepItem = ({ number, text, active }: StepItemProps) => {
  return (
    <div
      className={`flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl transition-all duration-300 w-full ${
        active
          ? "bg-white text-black border border-white shadow-lg shadow-white/5"
          : "bg-[#1A1A1A] text-white/50 border border-transparent"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          active ? "bg-black text-white" : "bg-white/10 text-white/40"
        }`}
      >
        {number}
      </div>
      <span className="text-sm font-medium tracking-tight">{text}</span>
    </div>
  );
};

// 2. Reusable SocialButton Component
interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SocialButton = ({ icon, label, onClick }: SocialButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 h-12 bg-black border border-white/10 rounded-xl hover:bg-white/5 active:scale-98 transition-all duration-250 cursor-pointer text-white text-xs font-semibold"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

// 3. Reusable InputGroup Component
interface InputGroupProps {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value?: any;
  onChange?: (e: any) => void;
  [key: string]: any;
}

const InputGroup = ({ label, placeholder, type = "text", ...props }: InputGroupProps) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-xs font-medium text-white/70 tracking-tight font-sans">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...props}
        className="bg-[#1A1A1A] border-none rounded-xl h-11 px-4 text-white placeholder:text-white/25 focus:ring-2 focus:ring-white/20 outline-none w-full text-sm font-sans transition-all"
      />
    </div>
  );
};

export default function AuroraSignUp({ onRegisterSuccess, onCancel }: AuroraSignUpProps) {
  // Local state managers
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Stagger parameters for Left Column Hero reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !lastName || !email || !password) {
      setErrorMsg("Please fill in all details.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password is too short. Try at least 8 symbols.");
      return;
    }

    // Step animation simulation prior success
    setActiveStep(2);
    setTimeout(() => {
      setActiveStep(3);
      setTimeout(() => {
        onRegisterSuccess({ firstName, lastName, email });
      }, 500);
    }, 700);
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4 text-white">
      {/* LEFT COLUMN: IMMERSIVE VIDEO HERO (52% Width on LG) */}
      <div className="hidden lg:flex w-[52%] relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
        {/* Playback video block - STRICTLY no gradient overlay or colors atop */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
            type="video/mp4"
          />
        </video>

        {/* Floating Cancel / Skip Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 z-20 flex items-center justify-center p-2 bg-black/60 hover:bg-black/80 rounded-full border border-white/10 text-white/80 hover:text-white cursor-pointer transition-all"
          title="Return to Marketplace"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Content with Framer Motion stagger reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10 w-full max-w-xs space-y-8"
        >
          {/* Logo container */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Circle className="w-6 h-6 text-white fill-white animate-spin-slow" />
            <span className="text-xl font-semibold tracking-tight">Aurora</span>
          </motion.div>

          {/* Heading container */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap">
              Join Aurora
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Follow these 3 quick phases to activate your space.
            </p>
          </motion.div>

          {/* Staggered progress step items */}
          <motion.div variants={itemVariants} className="space-y-3 w-full">
            <StepItem number={1} text="Register your identity" active={activeStep === 1} />
            <StepItem number={2} text="Configure your studio" active={activeStep === 2} />
            <StepItem number={3} text="Finalize your profile" active={activeStep === 3} />
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: REGISTRATION INPUT FORM PANEL */}
      <div className="flex-grow flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black relative">
        
        {/* Mobile Go-Back button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 lg:hidden flex items-center justify-center p-2 bg-neutral-900 border border-white/10 rounded-full text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-8 lg:space-y-6 sm:space-y-10"
        >
          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight text-white font-sans">
              Create New Profile
            </h2>
            <p className="text-white/40 text-sm font-sans">
              Input your basic details to begin the journey.
            </p>
          </div>

          {/* Social Auth Logins Grid */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={<Chrome className="w-4 h-4 text-white" />}
              label="Google SSO"
              onClick={() => {
                setFirstName("Ecosystem");
                setLastName("Leader");
                setEmail("volunteer@auroralabs.org");
                setPassword("aurora_secure_pass123");
              }}
            />
            <SocialButton
              icon={<Github className="w-4 h-4 text-white" />}
              label="GitHub"
              onClick={() => {
                setFirstName("Caterer");
                setLastName("Pro");
                setEmail("banquets@fivestarballroom.com");
                setPassword("aurora_secure_pass123");
              }}
            />
          </div>

          {/* Text Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative z-10 bg-black px-4 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              Or
            </span>
          </div>

          {/* Core Fields Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {errorMsg && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Names grid */}
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="First Name"
                placeholder="Sofia"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputGroup
                label="Last Name"
                placeholder="Vance"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email field */}
            <InputGroup
              label="Email Address"
              type="email"
              placeholder="sofia@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input group with view toggle and instruction snippet */}
            <div className="flex flex-col space-y-2 relative">
              <label className="text-xs font-medium text-white/70 tracking-tight font-sans">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1A1A1A] border-none rounded-xl h-11 pl-4 pr-11 text-white placeholder:text-white/25 focus:ring-2 focus:ring-white/20 outline-none w-full text-sm font-sans transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-white/40 hover:text-white cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-white/40 pl-1 font-sans">
                Requires at least 8 symbols.
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full h-14 bg-white hover:bg-neutral-100 text-black font-semibold text-sm rounded-xl cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-md mt-6 flex items-center justify-center"
            >
              <span>Create Account</span>
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-white/50 hover:text-white text-xs font-medium cursor-pointer transition-colors"
            >
              Member of the team? <span className="underline underline-offset-4 text-white font-semibold">Log in</span>
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
