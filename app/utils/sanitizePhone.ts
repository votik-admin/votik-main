export default function sanitizePhone(phone: string) {
  // Put the +91 if it is not there, else return the phone number as it is
  let finalPhone = phone;
  if (phone.length < 10) {
    throw new Error("Phone number is too short");
  }
  if (phone.length === 10) {
    finalPhone = `+91${phone}`;
  } else {
    if (phone.startsWith("+91")) {
      finalPhone = phone;
    } else if (phone.startsWith("91")) {
      finalPhone = `+${phone}`;
    } else if (phone.startsWith("0")) {
      finalPhone = `+91${phone.slice(1)}`;
    } else {
      throw new Error("Phone number is invalid");
    }
  }

  return finalPhone;
}

export function checkPhone(phone: string): boolean | string {
  try {
    sanitizePhone(phone);
    return true;
  } catch (error: any) {
    return error.message;
  }
}
