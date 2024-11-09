import { encrypt } from "@app/lib/enc";
import { Tables } from "@app/types/database.types";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailResponse {
  data: Record<string, any> | null;
  error: Error | null;
  message: string;
}

interface EmailData {
  toEmail: string;
  // MF Prince go die u and your ts
  dynamicData: Record<string, any>;
}

const sendTemplateEmail = async (
  emailData: EmailData
): Promise<EmailResponse> => {
  let { toEmail, dynamicData } = emailData;
  console.log({ toEmail });

  // Add QR data to dynamicData
  if (dynamicData?.tickets?.id) {
    const code = encrypt(dynamicData["tickets"]["id"]);
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/qr/gen/${code}`;

    dynamicData["tickets"]["friendly_code"] = code;
    dynamicData["tickets"]["qr_code_url"] = url;
  }

  const date = new Date(dynamicData["events"]["start_time"]);
  const formattedDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  dynamicData["events"]["start_date"] = formattedDate;
  dynamicData["events"]["start_time"] = formattedTime;

  const msg = {
    to: toEmail,
    from: "mmpl@votik.app",
    templateId: "d-ebcdaf98f1054bcca4be34be718d3ea9",
    dynamicTemplateData: dynamicData,
  };

  try {
    const res = await sgMail.send(msg);
    console.log(res[0].statusCode);
    const succes = res[0].statusCode === 202;

    if (succes) {
      return {
        data: res,
        error: null,
        message: "Email sent successfully",
      };
    } else {
      return {
        data: res,
        error: new Error("Failed to send email"),
        message: "Failed to send email",
      };
    }
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      data: null,
      error,
      message: errorMessage,
    };
  }
};

export default sendTemplateEmail;
