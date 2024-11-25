"use client";

import { Tables } from "@app/types/database.types";
import { formatTimeLabel } from "@app/utils/getTimeFromCurrentDate";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview({
  bookingsData,
}: {
  bookingsData: (Tables<"ticket_bookings"> & {
    events: Tables<"events"> | null;
    tickets: Tables<"tickets"> | null;
  })[];
}) {
  if (bookingsData.length === 0) return <></>;

  // status in ["BOOKED", "USED"]
  const lastBooking = new Date(bookingsData[0].payment_successful_timestamp!);
  const firstBooking = new Date(
    bookingsData[bookingsData.length - 1].payment_successful_timestamp!
  );
  const timeSpan = lastBooking.getTime() - firstBooking.getTime();

  const chartData: { name: string; total: number }[] = [];
  const f = {
    lessThanAnHour: {
      ticks: 60,
      timeDelta: 1000 * 60,
      filter: (bookingDate: Date, currentDate: Date) =>
        bookingDate.getMinutes() === currentDate.getMinutes() &&
        bookingDate.getHours() === currentDate.getHours() &&
        bookingDate.getDate() === currentDate.getDate() &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear(),
    },
    lessThanADay: {
      ticks: 24,
      timeDelta: 1000 * 60 * 60,
      filter: (bookingDate: Date, currentDate: Date) =>
        bookingDate.getHours() === currentDate.getHours() &&
        bookingDate.getDate() === currentDate.getDate() &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear(),
    },
    lessThanAMonth: {
      ticks: 30,
      timeDelta: 1000 * 60 * 60 * 24,
      filter: (bookingDate: Date, currentDate: Date) =>
        bookingDate.getDate() === currentDate.getDate() &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear(),
    },
    greaterThanOrEqualToAMonth: {
      ticks: 12,
      timeDelta: 1000 * 60 * 60 * 24 * 30,
      filter: (bookingDate: Date, currentDate: Date) =>
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear(),
    },
  };
  const populateChartData = (timeDiff: keyof typeof f) => {
    for (let i = 0; i < f[timeDiff].ticks; i++) {
      const currentDate = new Date(
        firstBooking.getTime() + i * f[timeDiff].timeDelta
      );
      const filteredBookings = bookingsData.filter((booking) => {
        const bookingDate = new Date(booking.payment_successful_timestamp!);
        return f[timeDiff].filter(bookingDate, currentDate);
      });
      const totalBookings = filteredBookings.reduce(
        (total, booking) =>
          total + booking.booked_count * (booking.tickets?.price || 0),
        0
      );

      chartData.push({
        name: formatTimeLabel(currentDate, timeSpan),
        total: totalBookings,
      });
    }
  };

  if (timeSpan < 1000 * 60) {
    populateChartData("lessThanAnHour");
  } else if (timeSpan < 1000 * 60 * 60 * 24) {
    populateChartData("lessThanADay");
  } else if (timeSpan < 1000 * 60 * 60 * 24 * 30) {
    populateChartData("lessThanAMonth");
  } else {
    populateChartData("greaterThanOrEqualToAMonth");
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
