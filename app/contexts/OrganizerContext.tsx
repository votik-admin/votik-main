"use client";

import supabase from "@app/lib/supabase";
import { Database, Tables } from "@app/types/database.types";
import { Session } from "@supabase/supabase-js";
import React from "react";

export const OrganizerContext = React.createContext<{
  session: Session | null;
  organizer: Tables<"organizers"> | null;
  loading: boolean;
}>({ session: null, organizer: null, loading: true });

const OrganizerProvider = ({
  children,
  initialSession = null,
  initialOrganizer = null,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
  initialOrganizer: Tables<"organizers"> | null;
}) => {
  const [session, setSession] = React.useState<Session | null>(
    initialSession ?? null
  );
  const [organizer, setOrganizer] = React.useState<Tables<"organizers"> | null>(
    initialOrganizer ?? null
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
          .from("organizers")
          .select("*")
          .eq("id", session.user.id);

        if (!error && data?.[0]) {
          setOrganizer(data[0]);
        }
        setLoading(false);
      })();
    } else {
      // check the current url
      const currentUrl = window.location.pathname;
      if (currentUrl.includes("/organizer")) {
        window.location.href = "/";
      }
      setOrganizer(null);
    }
  }, [session]);

  return (
    <OrganizerContext.Provider
      value={{
        session,
        organizer,
        loading,
      }}
    >
      {children}
    </OrganizerContext.Provider>
  );
};

export default OrganizerProvider;
