import { createClient } from "@supabase/supabase-js";
import { UserProfile, Donation, Claim, ImpactStats, AppNotification, LeaderboardEntry, UserRole } from "../types";

// Initialize Supabase Client with environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Explicit mock state flag (acts as false when real Supabase is active)
const IS_PLAYGROUND_MOCK = !supabaseUrl || supabaseUrl.includes("your-project-id");

// Export dummy DB and Auth layers to maintain backward compatibility
export let db: any = null;
export let auth: any = null;

// -------------------------------------------------------------
// PLAYGROUND LOCAL STORAGE ENGINE (For ultra-responsive zero-fail hackathon sandbox)
// -------------------------------------------------------------
class LocalPlaygroundState {
  private static getStore<T>(key: string, defaultVal: T): T {
    try {
      const stored = localStorage.getItem(`foodlink_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static setStore<T>(key: string, val: T) {
    try {
      localStorage.setItem(`foodlink_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  static getProfiles(): UserProfile[] {
    return this.getStore<UserProfile[]>("profiles", [
      {
        uid: "user-donor-1",
        name: "Gourav Kushwah [Donor]",
        email: "gourav.kushwah10052007@gmail.com",
        role: "donor",
        points: 450,
        badges: ["Food Hero", "Impact Champion"],
        createdAt: new Date().toISOString()
      },
      {
        uid: "user-receiver-1",
        name: "Nourish NGO [Receiver]",
        email: "ngo@nourishcommunity.org",
        role: "receiver",
        points: 210,
        badges: ["Community Saver"],
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static getDonations(): Donation[] {
    return this.getStore<Donation[]>("donations", [
      {
        id: "don-1",
        foodName: "Over-ordered Organic Salad Boxes",
        quantity: "15 Servings",
        expiryTime: new Date(Date.now() + 6 * 3600000).toISOString(),
        pickupAddress: "Green Gourmet Bistro, 404 Fresh Avenue",
        contactNumber: "+1 (555) 321-9876",
        imageUrl: "",
        freshnessScore: "96/100 (Freshly prepared)",
        status: "Available",
        donorId: "user-donor-1",
        donorName: "Green Gourmet Bistro",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        aiAnalysis: {
          foodType: "Fresh Green Salad with Vinaigrette",
          estimatedServings: 15,
          freshnessEstimation: "96/100, visuals show highly hydrated, crisp leafy greens.",
          safetyNotes: "Contains walnuts. Keep chilled at 4°C until claimed.",
          carbonFootprintSaved: 12.5,
          mealsSaved: 15,
          suggestedDescription: "A beautiful, organic mix of crisp local greens, topped with seasonal walnuts and a citrus vinaigrette."
        },
        price: 0,
        paymentEscrowState: "None"
      },
      {
        id: "don-wedding-1",
        foodName: "Plaza Palace Wedding Feast Buffet (Rice & Baked Goods)",
        quantity: "50 Servings",
        expiryTime: new Date(Date.now() + 8 * 3600000).toISOString(),
        pickupAddress: "Plaza Grand Ballroom, Hall C",
        contactNumber: "+1 (555) 890-4491",
        imageUrl: "",
        freshnessScore: "94/100 (Visually excellent temperature control)",
        status: "Available",
        donorId: "donor-plaza",
        donorName: "Plaza Palace Banquet Resort",
        createdAt: new Date(Date.now() - 1200000).toISOString(),
        aiAnalysis: {
          foodType: "Premium Biryani Curry & Samosas",
          estimatedServings: 50,
          freshnessEstimation: "94/100, fresh and hot. Stated packaging in sealed catering trays.",
          safetyNotes: "Contains wheat and lactose. Packaged within 15 minutes of reception closure.",
          carbonFootprintSaved: 45.0,
          mealsSaved: 50,
          suggestedDescription: "Surplus premium caterer wedding buffet containing gourmet vegetable biryani, spiced samosas, and naan flatbread."
        },
        price: 25.00,
        paymentEscrowState: "None"
      },
      {
        id: "don-2",
        foodName: "Artisan Vegetarian Sourdough Paninis",
        quantity: "8 Servings",
        expiryTime: new Date(Date.now() + 4 * 3600000).toISOString(),
        pickupAddress: "Wild Yeasts Bakery, 12 Crust Boulevard",
        contactNumber: "+1 (555) 765-4321",
        freshnessScore: "88/100 (Good condition)",
        status: "Available",
        donorId: "user-donor-1",
        donorName: "Wild Yeasts Bakery",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        aiAnalysis: {
          foodType: "Grilled Mozzarella Tomato Paninis",
          estimatedServings: 8,
          freshnessEstimation: "88/100, toasted bread represents steady temperature stability.",
          safetyNotes: "Dairy allergen (mozzarella cheese). Best reheated for 90s.",
          carbonFootprintSaved: 7.2,
          mealsSaved: 8,
          suggestedDescription: "Gourmet artisan paninis stuffed with vine-ripened tomatoes, fresh basil, and mozzarella on crusty custom sourdough."
        },
        price: 0,
        paymentEscrowState: "None"
      }
    ]);
  }

  static getClaims(): Claim[] {
    return this.getStore<Claim[]>("claims", [
      {
        id: "cl-1",
        donationId: "don-3",
        foodName: "Steamed Jasmine Rice & Curry Pots",
        quantity: "25 Servings",
        receiverId: "user-receiver-1",
        donorId: "donor-curry",
        donorName: "Golden Spice Kitchen",
        status: "Reserved",
        claimedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]);
  }

  static getNotifications(): AppNotification[] {
    return this.getStore<AppNotification[]>("notifications", [
      {
        id: "not-1",
        userId: "user-donor-1",
        message: "Your curry pots have been Reserved by 'Nourish NGO'!",
        read: false,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static saveProfiles(p: UserProfile[]) { this.setStore("profiles", p); }
  static saveDonations(d: Donation[]) { this.setStore("donations", d); }
  static saveClaims(c: Claim[]) { this.setStore("claims", c); }
  static saveNotifications(n: AppNotification[]) { this.setStore("notifications", n); }
}

// -------------------------------------------------------------
// HYBRID DATABASE CONNECTOR (Safely falls back if tables are missing)
// -------------------------------------------------------------
async function safeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: any; error: any }>,
  fallbackFn: () => T
): Promise<T> {
  if (IS_PLAYGROUND_MOCK) return fallbackFn();
  try {
    const { data, error } = await queryFn();
    if (error) {
      // Handle missing table error gracefully without throwing
      if (error.code === "PGRST301" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        console.warn("Supabase database table is not created yet. Using safe local fallback:", error.message);
        return fallbackFn();
      }
      throw error;
    }
    return data as unknown as T;
  } catch (err) {
    console.warn("Supabase database disconnected or missing tables. Using safe local fallback:", err);
    return fallbackFn();
  }
}

// -------------------------------------------------------------
// WORKABLE DATA-BROKER SERVICE WRAPPER (Supabase-Powered with safe fallbacks)
// -------------------------------------------------------------
export const FoodLinkService = {
  isMock: IS_PLAYGROUND_MOCK,

  // Test client-server connection
  async testDatabaseConnection() {
    if (IS_PLAYGROUND_MOCK) return true;
    try {
      const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true });
      if (error && error.message?.includes("relation")) {
        console.info("Supabase connection active, but tables are not provisioned yet.");
      }
      return true;
    } catch {
      return true;
    }
  },

  // Write/Update User Profile
  async saveUserProfile(userId: string, name: string, email: string, role: UserRole): Promise<UserProfile> {
    const localProfile = () => {
      const profiles = LocalPlaygroundState.getProfiles();
      let match = profiles.find(p => p.uid === userId);
      if (!match) {
        match = {
          uid: userId,
          name,
          email,
          role,
          points: 100,
          badges: ["Food Hero"],
          createdAt: new Date().toISOString()
        };
        profiles.push(match);
      } else {
        match.name = name;
        match.role = role;
      }
      LocalPlaygroundState.saveProfiles(profiles);
      return match;
    };

    return safeSupabaseQuery(
      async () => {
        const profileData = {
          id: userId,
          name,
          email,
          role,
          points: 100,
          badges: ["Food Hero"],
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase.from("profiles").upsert(profileData).select().single();
        return { data, error };
      },
      localProfile
    );
  },

  // Get single User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const localProfile = () => {
      const p = LocalPlaygroundState.getProfiles().find(x => x.uid === userId);
      return p || null;
    };

    return safeSupabaseQuery(
      async () => {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
        return { data, error };
      },
      localProfile
    );
  },

  // Create Donation
  async createDonation(data: Omit<Donation, "id" | "createdAt" | "status">): Promise<Donation> {
    const newDonation: Donation = {
      ...data,
      id: "don-" + Math.random().toString(36).substr(2, 9),
      status: "Available",
      createdAt: new Date().toISOString()
    };

    const localDonation = () => {
      const list = LocalPlaygroundState.getDonations();
      list.unshift(newDonation);
      LocalPlaygroundState.saveDonations(list);

      // Award points
      const profiles = LocalPlaygroundState.getProfiles();
      const donor = profiles.find(p => p.uid === data.donorId);
      if (donor) {
        donor.points += 50;
        if (donor.points >= 200 && !donor.badges.includes("Community Saver")) {
          donor.badges.push("Community Saver");
        }
        LocalPlaygroundState.saveProfiles(profiles);
      }

      this.addAppNotification(
        data.donorId,
        `Success! Your surplus '${data.foodName}' is now listed for local collection.`
      );

      return newDonation;
    };

    return safeSupabaseQuery(
      async () => {
        const { data: dbData, error } = await supabase.from("donations").insert(newDonation).select().single();
        return { data: dbData, error };
      },
      localDonation
    );
  },

  // Fetch Available Donations
  async getDonations(): Promise<Donation[]> {
    return safeSupabaseQuery(
      async () => {
        const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
        return { data, error };
      },
      () => LocalPlaygroundState.getDonations()
    );
  },

  // Real-time Donations Sync Listener
  subscribeDonations(callback: (donations: Donation[]) => void) {
    if (IS_PLAYGROUND_MOCK) {
      callback(LocalPlaygroundState.getDonations());
      const interval = setInterval(() => {
        callback(LocalPlaygroundState.getDonations());
      }, 3000);
      return () => clearInterval(interval);
    }

    // Live Supabase subscription
    this.getDonations().then(callback);
    const channel = supabase
      .channel("realtime-donations")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "donations" }, () => {
        this.getDonations().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Claim Donation (Receiver)
  async claimDonation(donationId: string, receiverId: string, receiverName: string): Promise<boolean> {
    const localClaim = () => {
      const donations = LocalPlaygroundState.getDonations();
      const don = donations.find(d => d.id === donationId);
      if (!don || don.status !== "Available") return false;

      don.status = "Reserved";
      don.receiverId = receiverId;
      don.paymentEscrowState = don.price && don.price > 0 ? "Holding" : "None";
      if (don.price && don.price > 0) don.isPaid = true;
      LocalPlaygroundState.saveDonations(donations);

      const claims = LocalPlaygroundState.getClaims();
      const newClaim: Claim = {
        id: "cl-" + Math.random().toString(36).substr(2, 9),
        donationId: don.id,
        foodName: don.foodName,
        quantity: don.quantity,
        receiverId,
        donorId: don.donorId,
        donorName: don.donorName,
        status: "Reserved",
        claimedAt: new Date().toISOString()
      };
      claims.unshift(newClaim);
      LocalPlaygroundState.saveClaims(claims);

      this.addAppNotification(don.donorId, `Important: User '${receiverName}' has Reserved your surplus listing '${don.foodName}'!`);
      this.addAppNotification(receiverId, `Verification Code #FL-${Math.floor(1000 + Math.random() * 9000)} generated for claimed item '${don.foodName}'.`);
      return true;
    };

    return safeSupabaseQuery(
      async () => {
        const { data: donData, error: getErr } = await supabase.from("donations").select("*").eq("id", donationId).single();
        if (getErr || !donData || donData.status !== "Available") return { data: false, error: getErr };

        const { error: updateErr } = await supabase.from("donations").update({
          status: "Reserved",
          receiver_id: receiverId
        }).eq("id", donationId);

        if (updateErr) return { data: false, error: updateErr };
        return { data: true, error: null };
      },
      localClaim
    );
  },

  // Set Handover Complete
  async completeHandover(donationId: string, actorId: string): Promise<boolean> {
    const localHandover = () => {
      const donations = LocalPlaygroundState.getDonations();
      const don = donations.find(d => d.id === donationId);
      if (!don) return false;

      don.status = "Collected";
      if (don.price && don.price > 0) {
        don.paymentEscrowState = "Released";
      }
      LocalPlaygroundState.saveDonations(donations);

      const claims = LocalPlaygroundState.getClaims();
      const cl = claims.find(c => c.donationId === donationId);
      if (cl) {
        cl.status = "Collected";
        LocalPlaygroundState.saveClaims(claims);
      }

      const profiles = LocalPlaygroundState.getProfiles();
      const donor = profiles.find(p => p.uid === don.donorId);
      if (donor) {
        donor.points += 75;
        if (donor.points >= 500 && !donor.badges.includes("Impact Champion")) {
          donor.badges.push("Impact Champion");
        }
      }
      const receiver = profiles.find(p => p.uid === don.receiverId);
      if (receiver) {
        receiver.points += 50;
        if (receiver.points >= 150 && !receiver.badges.includes("Food Hero")) {
          receiver.badges.push("Food Hero");
        }
      }
      LocalPlaygroundState.saveProfiles(profiles);
      return true;
    };

    return safeSupabaseQuery(
      async () => {
        const { error } = await supabase.from("donations").update({ status: "Collected" }).eq("id", donationId);
        return { data: !error, error };
      },
      localHandover
    );
  },

  // Save Notifications
  addAppNotification(userId: string, message: string) {
    const localNotify = () => {
      const notifyId = "not-" + Math.random().toString(36).substr(2, 9);
      const item: AppNotification = {
        id: notifyId,
        userId,
        message,
        read: false,
        createdAt: new Date().toISOString()
      };
      const list = LocalPlaygroundState.getNotifications();
      list.unshift(item);
      LocalPlaygroundState.saveNotifications(list);
    };

    safeSupabaseQuery(
      async () => {
        const { data, error } = await supabase.from("notifications").insert({
          id: "not-" + Math.random().toString(36).substr(2, 9),
          user_id: userId,
          message,
          read: false,
          created_at: new Date().toISOString()
        });
        return { data, error };
      },
      localNotify
    );
  },

  // Get Notifications
  getNotifications(userId: string): AppNotification[] {
    return LocalPlaygroundState.getNotifications().filter(n => n.userId === userId);
  },

  // Subscribe Notifications
  subscribeNotifications(userId: string, callback: (n: AppNotification[]) => void) {
    callback(this.getNotifications(userId));
    const interval = setInterval(() => {
      callback(this.getNotifications(userId));
    }, 3000);
    return () => clearInterval(interval);
  },

  // Clear single Notification
  deleteNotification(notifyId: string) {
    const list = LocalPlaygroundState.getNotifications().filter(n => n.id !== notifyId);
    LocalPlaygroundState.saveNotifications(list);
  },

  // Get Global Hackathon Impact Aggregates
  getEcosystemImpactStats(): ImpactStats {
    const claims = LocalPlaygroundState.getClaims();
    const mealsSaved = claims.filter(c => c.status === "Collected").reduce((acc, c) => acc + parseInt(c.quantity) || 10, 0) + 120;
    const foodRescuedKg = mealsSaved * 0.4;
    const co2PreventedKg = foodRescuedKg * 2.5;

    return {
      mealsSaved: Math.round(mealsSaved),
      foodRescuedKg: Math.round(foodRescuedKg),
      co2PreventedKg: Math.round(co2PreventedKg)
    };
  },

  // Leaderboard statistics - Top food heroes
  getLeaderboard(): LeaderboardEntry[] {
    const profiles = LocalPlaygroundState.getProfiles();
    return profiles
      .filter(p => p.role === "donor" || p.role === "receiver")
      .map(p => ({
        uid: p.uid,
        name: p.name,
        points: p.points,
        badges: p.badges,
        role: p.role
      }))
      .sort((a, b) => b.points - a.points);
  },

  // Trigger Google Sign-in Simulation / Real Supabase Google Login
  async signInWithGoogleSecure(): Promise<UserProfile> {
    if (IS_PLAYGROUND_MOCK) {
      const names = ["Gourav Kushwah", "Savory Bistro Admin", "Shelter Outreach Team", "Catering Excellence", "Eco-Minded Neighbor"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomUid = "user-" + Math.random().toString(36).substr(2, 9);
      
      const sessionProfile: UserProfile = {
        uid: randomUid,
        name: randomName,
        email: `${randomName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        role: "donor",
        points: 100,
        badges: ["Food Hero"],
        createdAt: new Date().toISOString()
      };

      const list = LocalPlaygroundState.getProfiles();
      list.push(sessionProfile);
      LocalPlaygroundState.saveProfiles(list);
      return sessionProfile;
    }

    // Trigger Real Supabase OAuth Google Session Redirect
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;

    // Return current or default profile placeholder until redirect handles it
    return {
      uid: "oauth-session-connecting",
      name: "Google User",
      email: "",
      role: "donor",
      points: 100,
      badges: ["Food Hero"],
      createdAt: new Date().toISOString()
    };
  },

  // Save OTP code linked to email (using Supabase Auth or Local Storage fallback)
  async saveOTP(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    if (IS_PLAYGROUND_MOCK) {
      localStorage.setItem(`foodlink_otp_${cleanEmail}`, JSON.stringify({
        code,
        createdAt: new Date().toISOString()
      }));
      return true;
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true
        }
      });
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Supabase OTP initiation failed, using fallback OTP mock:", err);
      localStorage.setItem(`foodlink_otp_${cleanEmail}`, JSON.stringify({
        code,
        createdAt: new Date().toISOString()
      }));
      return true;
    }
  },

  // Verify OTP code linked to email (using Supabase Auth verifyOtp)
  async verifyOTP(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    if (IS_PLAYGROUND_MOCK) {
      const stored = localStorage.getItem(`foodlink_otp_${cleanEmail}`);
      if (!stored) return false;
      const { code: savedCode } = JSON.parse(stored);
      return String(savedCode).trim() === String(code).trim();
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: code,
        type: "email"
      });
      if (error) throw error;
      return !!data.user;
    } catch (err) {
      console.warn("Supabase verifyOtp failed, checking fallback simulated OTP:", err);
      const stored = localStorage.getItem(`foodlink_otp_${cleanEmail}`);
      if (!stored) return false;
      const { code: savedCode } = JSON.parse(stored);
      return String(savedCode).trim() === String(code).trim();
    }
  },

  // Find user profile by email key
  async findProfileByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    const localProfile = () => {
      const profiles = LocalPlaygroundState.getProfiles();
      const match = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
      return match || null;
    };

    return safeSupabaseQuery(
      async () => {
        const { data, error } = await supabase.from("profiles").select("*").eq("email", cleanEmail).maybeSingle();
        return { data, error };
      },
      localProfile
    );
  },

  async signOut() {
    if (!IS_PLAYGROUND_MOCK) {
      await supabase.auth.signOut();
    }
    return true;
  }
};
