import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

export function mapFirebaseUserToSession(user: any) {
  if (!user) return null;
  return {
    access_token: "firebase-token-" + user.uid,
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "firebase-refresh",
    user: {
      id: user.uid,
      email: user.email || "",
      role: "authenticated",
      user_metadata: {
        full_name: user.displayName || user.email?.split("@")[0] || "User",
      },
    },
  };
}

const mockAuth = {
  getSession: async () => {
    try {
      await auth.authStateReady();
    } catch (e) {
      console.error("Firebase authStateReady failed", e);
    }
    const session = mapFirebaseUserToSession(auth.currentUser);
    return { data: { session }, error: null as any };
  },
  getUser: async () => {
    try {
      await auth.authStateReady();
    } catch (e) {
      console.error("Firebase authStateReady failed", e);
    }
    const user = auth.currentUser;
    const session = mapFirebaseUserToSession(user);
    return { data: { user: session ? session.user : null }, error: null as any };
  },
  signInWithPassword: async (args: { email: string; password?: string }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, args.email, args.password || "");
      const session = mapFirebaseUserToSession(userCredential.user);
      return { data: { session, user: session?.user }, error: null as any };
    } catch (err: any) {
      return { data: { session: null, user: null }, error: err };
    }
  },
  signUp: async (args: { email: string; password?: string; options?: any }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, args.email, args.password || "");
      const user = userCredential.user;
      const fullName = args.options?.data?.full_name;
      if (fullName) {
        await updateProfile(user, { displayName: fullName });
      }
      const session = mapFirebaseUserToSession(user);
      return { data: { session, user: session?.user }, error: null as any };
    } catch (err: any) {
      return { data: { session: null, user: null }, error: err };
    }
  },
  signInWithOAuth: async (args: { provider: string; options?: any }) => {
    if (args.provider !== "google") {
      return { data: { session: null }, error: new Error("Only Google is supported via Firebase") as any };
    }
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const session = mapFirebaseUserToSession(userCredential.user);
      return { data: { session, user: session?.user }, error: null as any };
    } catch (err: any) {
      return { data: { session: null }, error: err };
    }
  },
  signOut: async () => {
    try {
      await auth.signOut();
      return { error: null as any };
    } catch (err: any) {
      return { error: err };
    }
  },
  onAuthStateChange: (callback: any) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const session = mapFirebaseUserToSession(user);
      callback(user ? "SIGNED_IN" : "SIGNED_OUT", session);
    });
    return {
      data: {
        subscription: {
          unsubscribe,
        },
      },
    };
  },
};

// Export client
export const supabase = {
  auth: mockAuth,
  from: (table: string) => {
    console.warn(`Direct query to table "${table}" intercepted by mock Supabase client.`);
    return {
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null as any }),
        }),
      }),
    };
  },
};
