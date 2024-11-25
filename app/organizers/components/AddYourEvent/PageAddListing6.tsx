"use client";

import React, { FC, useEffect } from "react";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import CommonLayout from "./CommonLayout";
import { useParams, useRouter } from "next/navigation";
import ButtonSecondary from "@app/shared/Button/ButtonSecondary";
import { Tables } from "@app/types/database.types";
import { useForm } from "react-hook-form";
import supabase from "@app/lib/supabase";
import toast from "react-hot-toast";

export interface PageAddListing6Props {
  event: Tables<"events">;
  revalidate: () => Promise<void>;
}

type Faq = {
  question: string;
  answer: string;
};

type Tnc = string;

type Page6Form = {
  faqs: Faq[];
  tnc: Tnc[];
};

const PageAddListing6: FC<PageAddListing6Props> = ({ event, revalidate }) => {
  const { eventId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    revalidate();
  }, []);

  const defaultFaqs = event.faqs || [];
  const defaultTnc = event.tnc || [];

  const { setValue, register, watch, handleSubmit } = useForm<Page6Form>({
    defaultValues: {
      faqs: Array.isArray(defaultFaqs) ? (defaultFaqs as Faq[]) : [],
      tnc: Array.isArray(defaultTnc) ? (defaultTnc as Tnc[]) : [],
    },
  });

  const onSubmit = async (d: Page6Form) => {
    const toastId = toast.loading("Updating event...");
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          faqs: d.faqs,
          tnc: d.tnc,
        })
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event updated successfully", { id: toastId });

      router.push(`/organizer/event/${eventId}/edit/7`);
    } catch (err) {
      console.error("Failed to update event", err);
      toast.error("Failed to update event", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonLayout index="06">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">FAQs and Terms & Conditions</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">FAQs</h2>
              <div className="space-y-4 my-4">
                {watch("faqs").map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <input
                      type="text"
                      className="input rounded-md"
                      placeholder="Question"
                      {...register(`faqs.${i}.question` as const)}
                    />
                    <textarea
                      className="input rounded-md"
                      placeholder="Answer"
                      {...register(`faqs.${i}.answer` as const)}
                    />
                  </div>
                ))}
              </div>
              <ButtonSecondary
                className="mt-4"
                type="button"
                onClick={() =>
                  setValue("faqs", [
                    ...watch("faqs"),
                    { question: "", answer: "" },
                  ])
                }
              >
                Add FAQ
              </ButtonSecondary>
            </div>
            <div>
              <h2 className="text-lg font-bold">Terms & Conditions</h2>
              <div className="space-y-4 my-4">
                {watch("tnc").map((tnc, i) => (
                  <div key={i} className="space-y-2">
                    <textarea
                      className="input rounded-md"
                      placeholder="Content"
                      {...register(`tnc.${i}` as const)}
                    />
                  </div>
                ))}
              </div>
              <ButtonSecondary
                type="button"
                className="mt-4"
                onClick={() => setValue("tnc", [...watch("tnc"), ""])}
              >
                Add T&C
              </ButtonSecondary>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <ButtonSecondary
              type="button"
              onClick={() => router.push(`/organizer/event/${eventId}/edit/5`)}
            >
              Back
            </ButtonSecondary>
            <ButtonPrimary type="submit" loading={loading}>
              Publish event
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};

export default PageAddListing6;
