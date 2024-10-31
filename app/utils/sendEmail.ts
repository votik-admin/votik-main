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

  // add friendly code
  if (dynamicData?.tickets?.id)
    dynamicData["tickets"]["friendlyCode"] = encrypt(
      dynamicData["tickets"]["id"]
    );

  // TODO: fix: add friendly code
  // TODO: add: dynamic qr link

  const msg = {
    to: toEmail,
    from: "mmpl@votik.app",
    templateId: "d-ebcdaf98f1054bcca4be34be718d3ea9",
    dynamicTemplateData: dynamicData,
  };

  try {
    const res = await sgMail.send(msg);
    console.log(res);
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
