import { Tables } from "@app/types/database.types";
import * as XLSX from "xlsx";

function exportBookingsToCSV(
  bookings: (Tables<"ticket_bookings"> & {
    events: Tables<"events"> | null;
    tickets: Tables<"tickets"> | null;
  })[]
) {
  // Define the columns we want to export
  const columns = [
    "Booking ID",
    "User ID",
    "Event Name",
    "Ticket Name",
    "Ticket Price",
    "Booked Count",
    "Booked Status",
    "Payment Initiated",
    "Payment Successful",
    "Razorpay Order ID",
    "Razorpay Payment ID",
  ];

  // Convert bookings to CSV rows
  const csvRows = bookings.map((booking) => [
    booking.id,
    booking.user_id,
    booking.events?.name,
    booking.tickets?.name,
    booking.tickets?.price,
    booking.booked_count,
    booking.status,
    new Date(booking.payment_initiated_timestamp).toLocaleString(),
    booking.payment_successful_timestamp
      ? new Date(booking.payment_successful_timestamp).toLocaleString()
      : "",
    booking.razorpay_order_id,
    booking.razorpay_payment_id,
  ]);

  // Prepare CSV content
  const csvContent = [
    columns.join(","),
    ...csvRows.map((row) =>
      row
        .map(
          (value) =>
            // Escape commas and quotes, wrap in quotes if needed
            `"${String(value).replace(/"/g, '""')}"`
        )
        .join(",")
    ),
  ].join("\n");

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element and trigger download
  const filename = `${bookings?.[0]?.events?.slug || ""}-bookings.csv`;
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(link.href);
}

function exportBookingsToExcel(
  bookings: (Tables<"ticket_bookings"> & {
    events: Tables<"events"> | null;
    tickets: Tables<"tickets"> | null;
  })[]
) {
  // Prepare the data for Excel export
  const excelData = bookings.map((booking) => ({
    "Booking ID": booking.id,
    "User ID": booking.user_id,
    "Event Name": booking.events?.name,
    "Ticket Name": booking.tickets?.name,
    "Ticket Price": booking.tickets?.price,
    "Booked Count": booking.booked_count,
    "Booked Status": booking.status,
    "Payment Initiated": new Date(
      booking.payment_initiated_timestamp
    ).toLocaleString(),
    "Payment Successful": booking.payment_successful_timestamp
      ? new Date(booking.payment_successful_timestamp).toLocaleString()
      : "",
    "Razorpay Order ID": booking.razorpay_order_id,
    "Razorpay Payment ID": booking.razorpay_payment_id,
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

  // Generate the Excel file
  const filename = `${bookings?.[0]?.events?.slug || ""}-bookings.xlsx`;

  // Trigger file download
  XLSX.writeFile(workbook, filename);
}

export { exportBookingsToCSV, exportBookingsToExcel };
