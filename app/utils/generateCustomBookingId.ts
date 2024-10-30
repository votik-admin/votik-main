export default function generateBookingId(num: number): string {
  // Define the characters to use (0-9 and A-Z, total 36 characters)
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let bookingId = "";

  // Convert the number into the custom Base36 format
  while (num > 0) {
    bookingId = chars[num % 36] + bookingId;
    num = Math.floor(num / 36);
  }

  // Pad the booking ID to ensure it's always 7 characters long
  return `VOTIK${bookingId.padStart(7, "0")}`;
}
