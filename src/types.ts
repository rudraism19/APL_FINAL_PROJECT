export type UserRole = "donor" | "receiver";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  badges: string[];
  createdAt: string;
}

export interface AIDecision {
  foodType: string;
  estimatedServings: number;
  freshnessEstimation: string;
  safetyNotes: string;
  carbonFootprintSaved: number;
  mealsSaved: number;
  suggestedDescription: string;
  isMock?: boolean;
}

export interface Donation {
  id: string;
  foodName: string;
  quantity: string;
  expiryTime: string; // ISO string
  pickupAddress: string;
  contactNumber: string;
  imageUrl?: string; // base64 string
  freshnessScore: string;
  status: "Available" | "Reserved" | "Collected";
  donorId: string;
  donorName: string;
  receiverId?: string;
  aiAnalysis?: AIDecision;
  createdAt: string; // ISO string
  price?: number; // 0 or undefined means free, positive value represents low-cost selling price.
  isPaid?: boolean;
  paymentEscrowState?: "None" | "Holding" | "Released" | "Refunded";
}

export interface Claim {
  id: string;
  donationId: string;
  foodName: string;
  quantity: string;
  receiverId: string;
  donorId: string;
  donorName: string;
  status: "Reserved" | "Collected";
  claimedAt: string;
}

export interface ImpactStats {
  mealsSaved: number;
  foodRescuedKg: number;
  co2PreventedKg: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  points: number;
  badges: string[];
  role: UserRole;
}
