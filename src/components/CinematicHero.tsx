import { useEffect, useRef, useState } from "react";
import { ArrowRight, Leaf, Shield, Globe } from "lucide-react";

interface CinematicHeroProps {
  onBegin: () => void;
}

export default function CinematicHero({ onBegin }: CinematicHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animFrameId: number;
    const FADE_LIMIT = 0.5; // Fade over 0.5s

    const monitorTimeline = () => {
      if (!video) return;
      const current = video.currentTime;
      const duration = video.duration;

      if (duration > 0) {
        if (current < FADE_LIMIT) {
          // Fade in at start (0 -> 1)
          setOpacity(current / FADE_LIMIT);
        } else if (current > duration - FADE_LIMIT) {
          // Fade out before end (1 -> 0)
          setOpacity(Math.max(0, (duration - current) / FADE_LIMIT));
        } else {
          setOpacity(1);
        }
      }
      animFrameId = requestAnimationFrame(monitorTimeline);
    };

    animFrameId = requestAnimationFrame(monitorTimeline);

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(e => console.log("Video playback delayed:", e));
        }
      }, 100);
    };

    video.addEventListener("ended", handleEnded);

    // Initial play trigger
    video.play().catch(e => console.log("User interaction required for autoplay:", e));

    return () => {
      cancelAnimationFrame(animFrameId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F7F9F7]">
      {/* Ambient Glowing Blobs of Frosted Glass Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[100px]" />
      </div>

      {/* Background Video Layer */}
      <div 
        className="absolute z-0 transition-opacity duration-300"
        style={{ 
          top: "300px", 
          inset: "300px 0 0 0",
          opacity: opacity,
        }}
      >
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="h-full w-full object-cover animate-pulse"
          muted
          playsInline
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F9F7] via-transparent to-[#F7F9F7]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-start text-center px-6 pt-24 sm:pt-32 pb-32 max-w-7xl mx-auto">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-8 animate-fade-rise border border-white/60 shadow-sm backdrop-blur-md">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Reducing Food Waste With Zero Friction</span>
        </div>

        {/* Cinematic Headline */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] font-serif font-normal text-[#111827] text-shadow-premium tracking-tight animate-fade-rise"
          style={{ letterSpacing: "-2.46px", fontFamily: "Georgia, serif" }}
        >
          Turn <span className="italic text-gray-500">Surplus Food</span><br />
          Into Hope.
        </h1>

        {/* Body Description */}
        <p className="text-base sm:text-xl max-w-2xl mt-8 leading-relaxed text-gray-500 font-sans antialiased animate-fade-rise-delay">
          AI-powered redistribution connecting brilliant chefs, fearless volunteers, and communities in need. 
          Through the waste, we craft digital havens for pure social impact.
        </p>

        {/* Hero CTA Button */}
        <button
          onClick={onBegin}
          className="group relative inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-14 py-5 font-sans font-semibold text-base mt-12 shadow-lg shadow-emerald-200/50 hover:shadow-emerald-200/80 hover:scale-105 transition-all duration-300 animate-fade-rise-delay-2 cursor-pointer"
        >
          <span>Begin Journey</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* Feature Cards Grid (Seamless Blend of Theme & Food Rescue Value Proposition) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-32 animate-fade-rise-delay-2">
          
          <div className="glass-panel p-6 rounded-3xl text-left hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-white/40 flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[#111827] font-sans mb-1">AI Food Analysis</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Gemini verifies food quality, estimated portions, and allergen details instantly from a single upload.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-left hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-white/40 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[#111827] font-sans mb-1">Secure Transactions</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Verified user roles, locked-state claims workflows, and secure Firestore rules guarantee transparency.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl text-left hover:shadow-md hover:scale-[1.01] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-white/40 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-[#111827] font-sans mb-1">Carbon Tracking</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Translate every rescued item into tangible offset metrics: CO₂ prevented and equivalent meals saved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
