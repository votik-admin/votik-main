"use client";

import supabase from "@app/lib/supabase";
import { Database } from "@app/types/database.types";
import { Session } from "@supabase/supabase-js";
import React from "react";

export const SessionContext = React.createContext<{
  session: Session | null;
  user: Database["public"]["Tables"]["users"]["Row"] | null;
  loading: boolean;
}>({ session: null, user: null, loading: true });

const SessionProvider = ({
  children,
  initialSession = null,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
  initialUser: Database["public"]["Tables"]["users"]["Row"] | null;
}) => {
  const [session, setSession] = React.useState<Session | null>(
    initialSession ?? null
  );
  const [user, setUser] = React.useState<
    Database["public"]["Tables"]["users"]["Row"] | null
  >(initialUser ?? null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (session) {
      (async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id);

        if (!error && data?.[0]) {
          setUser(data[0]);
        }
        setLoading(false);
      })();
    } else {
      const currentUrl = window.location.pathname;
      if (currentUrl.includes("/user")) {
        window.location.href = "/";
      }
      setUser(null);
    }
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        user,
        loading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
