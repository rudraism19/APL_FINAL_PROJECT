import { useState } from "react";
import { Search, MapPin, Clock, ShieldAlert, Sparkles, AlertCircle, Phone, ArrowUpRight, CheckCircle, X } from "lucide-react";
import { Donation } from "../types";

interface DonationFeedProps {
  donations: Donation[];
  currentUserUid: string;
  currentUserRole: "donor" | "receiver";
  currentUserName: string;
  onClaim: (donationId: string) => void;
  onComplete: (donationId: string) => void;
}

export default function DonationFeed({
  donations,
  currentUserUid,
  currentUserRole,
  currentUserName,
  onClaim,
  onComplete
}: DonationFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [checkoutItem, setCheckoutItem] = useState<Donation | null>(null);

  // Filter Categories mappings
  const categories = [
    { id: "all", label: "All surplus" },
    { id: "salad", label: "Salads & Greens" },
    { id: "bakery", label: "Baked Goods" },
    { id: "meal", label: "Warm Meals" },
    { id: "curry", label: "Curries & Rice" },
  ];

  const filtered = donations.filter((don) => {
    const matchesSearch =
      don.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      don.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      don.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;

    if (selectedCategory === "salad") {
      return matchesSearch && (don.foodName.toLowerCase().includes("salad") || don.foodName.toLowerCase().includes("veggie") || don.foodName.toLowerCase().includes("green"));
    }
    if (selectedCategory === "bakery") {
      return matchesSearch && (don.foodName.toLowerCase().includes("panini") || don.foodName.toLowerCase().includes("bread") || don.foodName.toLowerCase().includes("pastry") || don.foodName.toLowerCase().includes("sourdough"));
    }
    if (selectedCategory === "meal") {
      return matchesSearch && (don.foodName.toLowerCase().includes("rice") || don.foodName.toLowerCase().includes("pot") || don.foodName.toLowerCase().includes("curry") || don.foodName.toLowerCase().includes("meal"));
    }
    if (selectedCategory === "curry") {
      return matchesSearch && (don.foodName.toLowerCase().includes("curry") || don.foodName.toLowerCase().includes("paneer") || don.foodName.toLowerCase().includes("butter"));
    }

    return matchesSearch;
  });

  const getRemainingTimeText = (expiryTimeStr: string) => {
    const diffMs = new Date(expiryTimeStr).getTime() - Date.now();
    if (diffMs <= 0) return "Expired / Safety Threshold Reached";
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    if (hours === 0) return `${mins}m left`;
    return `${hours}h ${mins}m left`;
  };

  const getStatusBadgeColor = (status: Donation["status"]) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "Reserved":
        return "bg-amber-50 text-amber-800 border-amber-100";
      case "Collected":
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2 border-b border-white/40">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings by food, donor name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/60 bg-white/35 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white/60 backdrop-blur-md transition-all shadow-sm"
          />
        </div>

        {/* Category Tags */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "bg-white/40 text-gray-500 hover:text-black hover:bg-white/70 border border-white/50 backdrop-blur-sm"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/30 backdrop-blur-md rounded-3xl border border-white/50 space-y-3">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-sm font-medium text-gray-800">No active donations match your search criteria</p>
          <p className="text-xs text-gray-500">Modify your search keyword or browse additional categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((don) => {
            const isOwner = don.donorId === currentUserUid;
            const isClaimer = don.receiverId === currentUserUid;

            return (
              <div
                key={don.id}
                className="group bg-white/45 hover:bg-white/65 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/65 hover:shadow-xl shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Image or Gradient */}
                <div className="relative h-44 w-full bg-slate-100">
                  {don.imageUrl ? (
                    <img
                      src={don.imageUrl}
                      alt={don.foodName}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 flex items-center justify-center p-6 text-center">
                      <Sparkles className="w-8 h-8 text-emerald-600/45 animate-pulse" />
                    </div>
                  )}

                  {/* Status Tag Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(don.status)} shadow-sm`}>
                      {don.status}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm ${
                      don.price && don.price > 0 
                        ? "bg-amber-600 text-white border-amber-500/30 font-semibold" 
                        : "bg-emerald-600 text-white border-emerald-500/30"
                    }`}>
                      {don.price && don.price > 0 ? `$${don.price.toFixed(2)}` : "FREE"}
                    </span>
                  </div>

                  {/* Expiration Tag Overlay */}
                  <div className="absolute bottom-3 right-3 bg-[#111827]/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] sm:text-xs flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{getRemainingTimeText(don.expiryTime)}</span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-6 space-y-4 flex-grow">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-400 font-mono tracking-wider">
                      {don.donorName || "Anonymous Donor"}
                    </span>
                    <h3 className="text-base font-bold text-[#111827] group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {don.foodName}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Redistributed Amount</span>
                      <span className="font-semibold text-gray-800">{don.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Acquisition Cost</span>
                      <span className={`font-bold block ${don.price && don.price > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                        {don.price && don.price > 0 ? `$${don.price.toFixed(2)}` : "Free Surplus"}
                      </span>
                    </div>
                  </div>

                  {/* Location Coordinate */}
                  <div className="flex items-start gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{don.pickupAddress}</span>
                  </div>

                  {/* AI Safety Banner */}
                  {don.aiAnalysis && (
                    <div className="space-y-1 bg-emerald-50/40 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100/60 shadow-sm">
                      <span className="text-[10px] font-bold text-[#111827] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>AI Safety & Allergens</span>
                      </span>
                      <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
                        {don.aiAnalysis.safetyNotes}
                      </p>
                    </div>
                  )}

                  {/* Escrow System Security Notification */}
                  {don.price && don.price > 0 && (
                    <div className={`p-3 rounded-2xl border text-[10px] leading-relaxed flex flex-col gap-1 ${
                      don.paymentEscrowState === "Holding" 
                        ? "bg-amber-55/65 text-amber-900 border-amber-200/50" 
                        : don.paymentEscrowState === "Released" 
                        ? "bg-emerald-55/65 text-emerald-950 border-emerald-200/50" 
                        : "bg-white/40 text-neutral-850 border-white/50"
                    }`}>
                      <div className="flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <span>FoodSafe Escrow Escort</span>
                      </div>
                      <p>
                        {don.status === "Available" && `Funds Safe check: NGO buy cost of $${don.price.toFixed(2)} is held securely prior onward transport.`}
                        {don.status === "Reserved" && `Escrow Active: $${don.price.toFixed(2)} held securely. Releases payout upon handover completion confirmation.`}
                        {don.status === "Collected" && `Escrow Complete: $${don.price.toFixed(2)} successfully released to vendor.`}
                      </p>
                    </div>
                  )}

                  {/* Coded Contact details (once reserved/claimed) */}
                  {(isOwner || isClaimer) && don.status !== "Available" && (
                    <div className="p-3.5 bg-neutral-900/80 backdrop-blur-md text-white rounded-2xl space-y-1.5 animate-fade-rise border border-white/10 shadow-md">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                        Redistribution Coordinates
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-200">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{don.contactNumber}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Claim Actions */}
                <div className="p-6 pt-0 border-t border-white/45 mt-auto bg-white/20 backdrop-blur-sm rounded-b-[32px]">
                  {don.status === "Available" && (
                    <>
                      {currentUserRole === "receiver" ? (
                        <button
                          onClick={() => {
                            if (don.price && don.price > 0) {
                              setCheckoutItem(don);
                            } else {
                              onClaim(don.id);
                            }
                          }}
                          className="w-full mt-4 py-2.5 bg-[#111827] hover:bg-black hover:scale-102 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-98"
                        >
                          <span>Claim Food Surplus</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        </button>
                      ) : (
                        <div className="w-full mt-4 py-2 text-center text-[10px] font-semibold text-gray-500 bg-white/40 border border-white/50 rounded-lg">
                          {isOwner ? "Listed & online" : "Receivers can claim item"}
                        </div>
                      )}
                    </>
                  )}

                  {don.status === "Reserved" && (
                    <>
                      {(isOwner || isClaimer) ? (
                        <button
                          onClick={() => onComplete(don.id)}
                          className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-98"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-300 animate-bounce" />
                          <span>Complete Handover</span>
                        </button>
                      ) : (
                        <div className="w-full mt-4 py-2 text-center text-xs font-semibold text-amber-800 bg-amber-50/60 border border-amber-100 rounded-xl">
                          Claimed & Reserved
                        </div>
                      )}
                    </>
                  )}

                  {don.status === "Collected" && (
                    <div className="w-full mt-4 py-2 text-center text-xs font-semibold text-gray-400 bg-white/40 rounded-xl flex items-center justify-center gap-1.5 border border-white/50">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-550" />
                      <span>Successfully Rescued</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dynamic Payment Escrow Authorization Checkout Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-white shadow-2xl space-y-6 animate-fade-rise">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">
                  Secure Checkout Escrow Flow
                </span>
                <h3 className="text-lg font-serif font-bold text-neutral-900" style={{ fontFamily: "Georgia, serif" }}>
                  Confirm Food Acquisition
                </h3>
              </div>
              <button
                onClick={() => setCheckoutItem(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl space-y-3 border border-amber-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-sans">Food Item:</span>
                <span className="font-semibold text-neutral-800 text-right font-sans">{checkoutItem.foodName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-sans">Source:</span>
                <span className="font-semibold text-neutral-800 font-sans">{checkoutItem.donorName}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-amber-200 font-bold">
                <span className="text-amber-800 font-sans">Total Held In Escrow:</span>
                <span className="text-amber-900 font-mono">${checkoutItem.price?.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-2 leading-relaxed">
              <p className="font-sans">
                🔒 **How our secure payment model safeguards delivery:**
              </p>
              <ul className="list-disc pl-4 space-y-1 font-sans">
                <li>Your charity authorizing a low-cost ${checkoutItem.price?.toFixed(2)} purchase gets held in our secure escrow wallet.</li>
                <li>The hotel/venue receives the reservation coordinate, preparing the temperature-safe containers.</li>
                <li>The money is strictly locked and **only released to the seller** once both of you mark the "Handover Complete" on site, guaranteeing food successfully reaches its receiver safely.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onClaim(checkoutItem.id);
                  setCheckoutItem(null);
                }}
                className="w-full py-3.5 bg-neutral-900 hover:bg-black hover:scale-[1.01] active:scale-99 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>Authorize & Pay Escrow (${checkoutItem.price?.toFixed(2)})</span>
              </button>
              <button
                onClick={() => setCheckoutItem(null)}
                className="w-full py-2.5 bg-white hover:bg-neutral-50 text-gray-500 text-xs font-semibold rounded-xl text-center cursor-pointer transition-all border border-neutral-100"
              >
                Cancel Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
