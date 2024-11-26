import React, { FC } from "react";
import { Helmet } from "react-helmet";
import SectionSubscribe2 from "@app/components/SectionSubscribe2/SectionSubscribe2";
import SocialsList from "@app/shared/SocialsList/SocialsList";
import Label from "@app/components/Label/Label";
import Input from "@app/shared/Input/Input";
import Textarea from "@app/shared/Textarea/Textarea";
import ButtonPrimary from "@app/shared/Button/ButtonPrimary";
import SectionClientSay from "@app/components/SectionClientSay/SectionClientSay";
import BackgroundSection from "@app/components/BackgroundSection/BackgroundSection";
import img from "@app/images/contactUs/main.png";
import { Metadata } from "next";

export interface ContactUsPageProps {
  className?: string;
}

const info = [
  // {
  //   title: "🗺 ADDRESS",
  //   desc: "Photo booth tattooed prism, portland taiyaki hoodie neutra typewriter",
  // },
  {
    title: "💌 EMAIL",
    desc: "mmpl@votik.app",
  },
  {
    title: "☎ PHONE",
    desc: "+91-9606472890",
  },
];

const ContactUsPage: FC<ContactUsPageProps> = ({ className = "" }) => {
  return (
    <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-12 ">
      <div className="max-w-sm space-y-8">
        <h2 className="my-16 sm:my-20 flex text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100">
          Contact us
        </h2>
        {info.map((item, index) => (
          <div key={index}>
            <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
              {item.title}
            </h3>
            <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
              {item.desc}
            </span>
          </div>
        ))}
        <div>
          <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
            🌏 SOCIALS
          </h3>
          <SocialsList className="mt-2" />
        </div>
        <div>
          <form
            className="grid grid-cols-1 gap-6"
            action="https://api.web3forms.com/submit"
            method="POST"
          >
            <input
              type="hidden"
              name="access_key"
              value="f9b89a13-f5ce-47e5-8937-f0f6059aad79"
            />
            <label className="block">
              <Label>Full name</Label>
              <Input
                name="full_name"
                placeholder="John Doe"
                type="text"
                className="mt-1"
              />
            </label>
            <label className="block">
              <Label>Email address</Label>
              <Input
                name="email"
                type="email"
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <Label>Message</Label>
              <Textarea name="message" className="mt-1" rows={6} />
            </label>
            <div>
              <ButtonPrimary type="submit">Send Message</ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden sm:block flex-grow mt-40">
        <img className="w-full" src={img.src} alt="" />
      </div>
    </div>
  );
};

export default ContactUsPage;

export const metadata: Metadata = {
  title: "Contact Us",
};
