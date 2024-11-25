import OrganizerPage from "@app/containers/OrganizerPage/OrganizerPage";
import { createServiceClient } from "@app/lib/supabase/serverAdmin";
import { notFound } from "next/navigation";

export default async function Page({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("organizers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return notFound();
  }

  return <OrganizerPage organizer={data} />;
}
