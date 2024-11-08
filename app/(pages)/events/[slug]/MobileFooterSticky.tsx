"use client";

import React, { useState } from "react";
import ModalReserveMobile from "./ModalReserveMobile";
import ButtonCustom from "@app/shared/Button/ButtonCustom";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import { Tables } from "@app/types/database.types";
import { getUserFromAuthTable, getUserFromUserTable } from "@app/queries";
import { useRouter } from "next/navigation";

const MobileFooterSticky = ({
  tickets,
  event_id,
}: {
  tickets?: Tables<"tickets">[];
  event_id?: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-20">
      <div className="container flex items-center justify-between">
        <div className="">
          <span className="block text-xl font-semibold">
            ₹{" "}
            {convertNumbThousand(
              tickets?.sort((a, b) => a.price - b.price)[0]?.price
            )}{" "}
            Onwards
          </span>
        </div>
        <ModalReserveMobile
          tickets={tickets}
          event_id={event_id}
          user={user!}
          renderChildren={({ openModal }) => (
            <ButtonCustom
              onClick={async () => {
                setLoading(true);
                const { data: authData, error: authError } =
                  await getUserFromAuthTable();
                const user = authData.user;
                if (authError || !user) {
                  // get the window path and encode it
                  const path = encodeURIComponent(window.location.pathname);
                  router.push(`/auth/login?redirect=${path}`);
                  return;
                }
                const { data, error } = await getUserFromUserTable(user!.id);
                setUser(data);
                setLoading(false);
                openModal();
              }}
              loading={loading}
            >
              BOOK NOW
            </ButtonCustom>
          )}
        />
      </div>
    </div>
  );
};

export default MobileFooterSticky;
