import { UserProfile, Donation, Claim, ImpactStats, AppNotification, LeaderboardEntry, UserRole } from "../types";

// Explicit mock state flag for local sandboxed execution
const IS_PLAYGROUND_MOCK = true;

// Export dummy DB and Auth layers to maintain compatibility with other parts of the system if referenced
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
        expiryTime: new Date(Date.now() + 6 * 3600000).toISOString(), // 6 hours from now
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
        expiryTime: new Date(Date.now() + 4 * 3600000).toISOString(), // 4 hours
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
      },
      {
        id: "don-hotel-1",
        foodName: "Grand Continental Hotel Breakfast surplus",
        quantity: "30 Servings",
        expiryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
        pickupAddress: "Grand Continental Hotel, Main Lobby Kitchen",
        contactNumber: "+1 (555) 124-9092",
        freshnessScore: "92/100 (Visual check approved)",
        status: "Available",
        donorId: "donor-gcont",
        donorName: "Grand Continental Hotel",
        createdAt: new Date(Date.now() - 5000000).toISOString(),
        aiAnalysis: {
          foodType: "Muffins, scrambled eggs, fresh fruit platters",
          estimatedServings: 30,
          freshnessEstimation: "92/100, bakery products are fresh, cold cuts insulated safely.",
          safetyNotes: "Eggs and gluten allergens. Needs prompt collection & refrigeration.",
          carbonFootprintSaved: 28.0,
          mealsSaved: 30,
          suggestedDescription: "Continental breakfast portions including pastries, bread rolls, safely insulated eggs, and fresh mixed berry bowls."
        },
        price: 15.00,
        paymentEscrowState: "None"
      },
      {
        id: "don-3",
        foodName: "Steamed Jasmine Rice & Curry Pots",
        quantity: "25 Servings",
        expiryTime: new Date(Date.now() + 2 * 3600000).toISOString(), // 2 hours
        pickupAddress: "Golden Spice Indian Kitchen",
        contactNumber: "+1 (555) 123-4567",
        freshnessScore: "91/100 (Hot)",
        status: "Reserved",
        donorId: "donor-curry",
        donorName: "Golden Spice",
        receiverId: "user-receiver-1",
        createdAt: new Date(Date.now() - 8000000).toISOString(),
        aiAnalysis: {
          foodType: "Paneer Butter Masala with Rice",
          estimatedServings: 25,
          freshnessEstimation: "91/100, steam levels indicate high temperature tracking.",
          safetyNotes: "Contains cashew paste and heavy dairy cream.",
          carbonFootprintSaved: 22.8,
          mealsSaved: 25,
          suggestedDescription: "Rich and creamy Paneer Butter Masala served with fluffy jasmine rice, packed ready in leakproof hot catering tray blocks."
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
      },
      {
        id: "not-2",
        userId: "user-receiver-1",
        message: "Yay! You successfully claimed 'Steamed Jasmine Rice & Curry Pots'. Check pickup address details.",
        read: false,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  static getImpactStats(): ImpactStats {
    const claims = this.getClaims();
    
    const mealsSaved = claims.filter(c => c.status === "Collected").reduce((acc, c) => acc + parseInt(c.quantity) || 10, 0) + 120;
    const foodRescuedKg = mealsSaved * 0.4;
    const co2PreventedKg = foodRescuedKg * 2.5;

    return {
      mealsSaved: Math.round(mealsSaved),
      foodRescuedKg: Math.round(foodRescuedKg),
      co2PreventedKg: Math.round(co2PreventedKg)
    };
  }

  static saveProfiles(p: UserProfile[]) { this.setStore("profiles", p); }
  static saveDonations(d: Donation[]) { this.setStore("donations", d); }
  static saveClaims(c: Claim[]) { this.setStore("claims", c); }
  static saveNotifications(n: AppNotification[]) { this.setStore("notifications", n); }
}

// -------------------------------------------------------------
// UNIFIED DATA-BROKER SERVICE WRAPPER (SANDBOXED Fallback Implementation)
// -------------------------------------------------------------
export const FoodLinkService = {
  isMock: IS_PLAYGROUND_MOCK,

  // Test client-server connection
  async testDatabaseConnection() {
    return true;
  },

  // Write/Update User Profile
  async saveUserProfile(userId: string, name: string, email: string, role: UserRole): Promise<UserProfile> {
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
  },

  // Get single User Profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const p = LocalPlaygroundState.getProfiles().find(x => x.uid === userId);
    return p || null;
  },

  // Create Donation
  async createDonation(data: Omit<Donation, "id" | "createdAt" | "status">): Promise<Donation> {
    const newDonation: Donation = {
      ...data,
      id: "don-" + Math.random().toString(36).substr(2, 9),
      status: "Available",
      createdAt: new Date().toISOString()
    };

    const list = LocalPlaygroundState.getDonations();
    list.unshift(newDonation);
    LocalPlaygroundState.saveDonations(list);

    // Award points for listing
    const profiles = LocalPlaygroundState.getProfiles();
    const donor = profiles.find(p => p.uid === data.donorId);
    if (donor) {
      donor.points += 50;
      if (donor.points >= 200 && !donor.badges.includes("Community Saver")) {
        donor.badges.push("Community Saver");
      }
      LocalPlaygroundState.saveProfiles(profiles);
    }

    // Add Notification
    this.addAppNotification(
      data.donorId,
      `Success! Your surplus '${data.foodName}' is now listed for local collection.`
    );

    return newDonation;
  },

  // Fetch Available Donations
  async getDonations(): Promise<Donation[]> {
    return LocalPlaygroundState.getDonations();
  },

  // Real-time Donations Sync Listener
  subscribeDonations(callback: (donations: Donation[]) => void) {
    // Simulate snapshot returns asynchronously
    callback(LocalPlaygroundState.getDonations());
    const interval = setInterval(() => {
      callback(LocalPlaygroundState.getDonations());
    }, 3000);
    return () => clearInterval(interval);
  },

  // Claim Donation (Receiver)
  async claimDonation(donationId: string, receiverId: string, receiverName: string): Promise<boolean> {
    const donations = LocalPlaygroundState.getDonations();
    const don = donations.find(d => d.id === donationId);
    if (!don || don.status !== "Available") return false;

    don.status = "Reserved";
    don.receiverId = receiverId;
    if (don.price && don.price > 0) {
      don.isPaid = true;
      don.paymentEscrowState = "Holding";
    } else {
      don.paymentEscrowState = "None";
    }
    LocalPlaygroundState.saveDonations(donations);

    // Create claim
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

    // Notify donor
    this.addAppNotification(
      don.donorId,
      `Important: User '${receiverName}' has Reserved your surplus listing '${don.foodName}'!`
    );

    // Notify receiver
    this.addAppNotification(
      receiverId,
      don.price && don.price > 0 
        ? `Funds secure: $${don.price.toFixed(2)} held in FoodLink Escrow. Verification code #FL-${Math.floor(1000 + Math.random() * 9000)} generated.`
        : `Verification Code #FL-${Math.floor(1000 + Math.random() * 9000)} generated for claimed item '${don.foodName}'.`
    );

    return true;
  },

  // Set Handover / Collected Complete
  async completeHandover(donationId: string, actorId: string): Promise<boolean> {
    const donations = LocalPlaygroundState.getDonations();
    const don = donations.find(d => d.id === donationId);
    if (!don) return false;

    don.status = "Collected";
    if (don.price && don.price > 0) {
      don.paymentEscrowState = "Released";
    }
    LocalPlaygroundState.saveDonations(donations);

    // Update Claim state
    const claims = LocalPlaygroundState.getClaims();
    const cl = claims.find(c => c.donationId === donationId);
    if (cl) {
      cl.status = "Collected";
      LocalPlaygroundState.saveClaims(claims);
    }

    // Add points & check achievements
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

    // Notification
    this.addAppNotification(
      don.donorId,
      don.price && don.price > 0
        ? `Ecosystem Handover Complete! $${don.price.toFixed(2)} payout has been safely released to your account.`
        : `Redistribution Complete! Outstanding effort — thank you for avoiding food waste.`
    );
    if (don.receiverId) {
      this.addAppNotification(
        don.receiverId,
        `Redistribution Complete! Escrow released. '${don.foodName}' is noted as successfully Collected.`
      );
    }

    return true;
  },

  // Save Notifications
  addAppNotification(userId: string, message: string) {
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
    return LocalPlaygroundState.getImpactStats();
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

  // Trigger Google Sign-in Simulation
  async signInWithGoogleSecure(): Promise<UserProfile> {
    const names = [
      "Gourav Kushwah",
      "Savory Bistro Admin",
      "Shelter Outreach Team",
      "Catering Excellence",
      "Eco-Minded Neighbor"
    ];
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
  },

  // Save OTP code linked to email coordinate (using Local Storage)
  async saveOTP(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    localStorage.setItem(`foodlink_otp_${cleanEmail}`, JSON.stringify({
      code,
      createdAt: new Date().toISOString()
    }));
    return true;
  },

  // Verify OTP code linked to email coordinate
  async verifyOTP(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    const stored = localStorage.getItem(`foodlink_otp_${cleanEmail}`);
    if (!stored) return false;
    const { code: savedCode } = JSON.parse(stored);
    return String(savedCode).trim() === String(code).trim();
  },

  // Find user profile by email key
  async findProfileByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    const profiles = LocalPlaygroundState.getProfiles();
    const match = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
    return match || null;
  },

  async signOut() {
    return true;
  }
};
