"use client";

import AddEvent1 from "@app/components/AddYourEvent/PageAddListing1";
import AddEvent2 from "@app/components/AddYourEvent/PageAddListing2";
import AddEvent3 from "@app/components/AddYourEvent/PageAddListing3";
import AddEvent4 from "@app/components/AddYourEvent/PageAddListing4";
import AddEvent5 from "@app/components/AddYourEvent/PageAddListing5";
import AddEvent6 from "@app/components/AddYourEvent/PageAddListing6";
import AddEvent7 from "@app/components/AddYourEvent/PageAddListing7";
import AddEvent8 from "@app/components/AddYourEvent/PageAddListing8";
import AddEvent9 from "@app/components/AddYourEvent/PageAddListing9";
import AddEvent10 from "@app/components/AddYourEvent/PageAddListing10";
import { useParams } from "next/navigation";

const FormMap: { [x: string]: React.ReactNode } = {
  1: <AddEvent1 />,
  2: <AddEvent2 />,
  3: <AddEvent3 />,
  4: <AddEvent4 />,
  5: <AddEvent5 />,
  6: <AddEvent6 />,
  7: <AddEvent7 />,
  8: <AddEvent8 />,
  9: <AddEvent9 />,
  10: <AddEvent10 />,
};

export default function AddListing() {
  const { id } = useParams();
  if (!id || Array.isArray(id)) return <AddEvent1 />;

  return FormMap[id] || <AddEvent1 />;
}
