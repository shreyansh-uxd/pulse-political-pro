import { getMockSession, setMockSession, clearMockSession } from "@/lib/mock-db";

const mockAuth = {
  getSession: async () => {
    return { data: { session: getMockSession() }, error: null as any };
  },
  getUser: async () => {
    const session = getMockSession();
    return { data: { user: session ? session.user : null }, error: null as any };
  },
  signInWithPassword: async (args: { email: string; password?: string }) => {
    const session = setMockSession(args.email);
    return { data: { session, user: session?.user }, error: null as any };
  },
  signUp: async (args: { email: string; password?: string; options?: any }) => {
    const session = setMockSession(args.email);
    return { data: { session, user: session?.user }, error: null as any };
  },
  signInWithOAuth: async (args: { provider: string; options?: any }) => {
    const session = setMockSession("google-user@example.com");
    return { data: { session, user: session?.user }, error: null as any };
  },
  signOut: async () => {
    clearMockSession();
    return { error: null as any };
  },
  onAuthStateChange: (callback: any) => {
    const session = getMockSession();
    callback(session ? "SIGNED_IN" : "SIGNED_OUT", session);
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};

// Export fully mocked client
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
