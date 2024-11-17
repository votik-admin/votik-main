"use client";

import supabase from "@app/lib/supabase";
import { Database, Tables } from "@app/types/database.types";
import { Session } from "@supabase/supabase-js";
import React from "react";

export const ChatSessionContext = React.createContext<{
  session: Session | null;
  user: Tables<"users_public"> | null;
  loading: boolean;
}>({ session: null, user: null, loading: true });

const ChatSessionProvider = ({
  children,
  initialSession = null,
  initialUser = null,
  onLogoutBlock = false,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
  initialUser: Tables<"users_public"> | null;
  onLogoutBlock?: boolean;
}) => {
  const [session, setSession] = React.useState<Session | null>(
    initialSession ?? null
  );
  const [user, setUser] = React.useState<Tables<"users_public"> | null>(
    initialUser ?? null
  );
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
          .from("users_public")
          .select("*")
          .eq("id", session.user.id);

        if (!error && data?.[0]) {
          setUser(data[0]);
        } else {
          setUser(null);
        }
        setLoading(false);
      })();
    } else {
      setUser(null);
    }
  }, [session]);

  if (onLogoutBlock && !session) {
    return null;
  }

  return (
    <ChatSessionContext.Provider
      value={{
        session,
        user,
        loading,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export default ChatSessionProvider;
