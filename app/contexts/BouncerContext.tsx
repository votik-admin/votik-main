"use client";

import { Tables } from "@app/types/database.types";
import { createContext, useEffect, useState } from "react";

type Session =
  | Tables<"bouncer_logins"> & {
      events: Tables<"events">;
    };

const BouncerContext = createContext<{
  session: Session | null;
  setSession: (session: Session | null) => void;
}>({
  session: null,
  setSession: () => {},
});

export const BouncerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set and get session from session storage
    if (session) {
      sessionStorage.setItem("bouncerSession", JSON.stringify(session));
    } else {
      sessionStorage.removeItem("bouncerSession");
    }
  }, [session]);

  useEffect(() => {
    // Get session from session storage
    const session = sessionStorage.getItem("bouncerSession");
    if (session) {
      setSession(JSON.parse(session));
    }
  }, []);

  return (
    <BouncerContext.Provider value={{ session, setSession }}>
      {children}
    </BouncerContext.Provider>
  );
};

export default BouncerContext;
