import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isBlocked: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  viewAsStudent: boolean;
  setViewAsStudent: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isBlocked: false,
  loading: true,
  signOut: async () => {},
  viewAsStudent: false,
  setViewAsStudent: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewAsStudent, setViewAsStudentState] = useState(() => {
    return localStorage.getItem("technoml_view_as_student") === "true";
  });

  const setViewAsStudent = (v: boolean) => {
    localStorage.setItem("technoml_view_as_student", String(v));
    setViewAsStudentState(v);
  };

  const checkRole = async (userId: string, email?: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    setIsAdmin(!!data);
  };

  const checkBlocked = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("is_blocked").eq("user_id", userId).single();
    setIsBlocked(!!data?.is_blocked);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth event:", _event);
      if (_event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsBlocked(false);
        setLoading(false);
        return;
      }
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        // Defer Supabase calls to avoid deadlocking the auth callback
        setTimeout(() => {
          Promise.all([checkRole(u.id, u.email), checkBlocked(u.id)])
            .catch((e) => console.error("Auth init error:", e))
            .finally(() => setLoading(false));
        }, 0);
        return;
      } else {
        setIsAdmin(false);
        setIsBlocked(false);
      }
      setLoading(false);
    });

    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      console.log("getUser result:", { user: user?.email, error });
      if (error || !user) {
        setUser(null);
        setIsAdmin(false);
        setIsBlocked(false);
        setLoading(false);
      } else {
        setUser(user);
        try {
          await Promise.all([checkRole(user.id, user.email), checkBlocked(user.id)]);
        } catch (e) {
          console.error("Auth init error:", e);
        } finally {
          setLoading(false);
        }
      }
    });

    // Failsafe: force loading to false after 5 seconds
    const timeout = setTimeout(() => {
      setLoading(prev => {
        if (prev) console.warn("Forced loading to false via failsafe timeout.");
        return false;
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    // Optimistically clear the state first to avoid unresponsive UI
    setUser(null);
    setIsAdmin(false);
    setIsBlocked(false);
    
    // Force clear local storage keys that might keep the session alive
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('supabase.auth.token');

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isBlocked, loading, signOut, viewAsStudent, setViewAsStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
