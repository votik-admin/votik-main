"use client";

import React from "react";

import { Button } from "@app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { Tabs, TabsContent } from "@app/components/ui/tabs";
import { Overview } from "@app/(organizers)/organizer/dashboard/components/overview";
import { RecentSales } from "@app/(organizers)/organizer/dashboard/components/recent-sales";
import useSWR from "swr";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import Spinner from "@app/components/Spinner/Spinner";
import { exportBookingsToExcel } from "@app/utils/exportBookings";
import CardCategoryCustom from "@app/components/CardCategoryCustom/CardCategoryCustom";
import Link from "next/link";

export default function DashboardPageAccumulated({
  organizer,
}: {
  organizer: Tables<"organizers">;
}) {
  const {
    data: eventsData,
    error: errorData,
    isLoading: isLoadingEvents,
  } = useSWR("getAllEventsByOrganizer", async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*, tickets(*)")
      .eq("organizer_id", organizer.id)
      .order("created_at", { ascending: false });
    if (error) throw error.message;
    return data;
  });

  const {
    data: bookingsData,
    error: bookingError,
    isLoading: isLoadingBookings,
  } = useSWR("getAllBookings", async () => {
    const { data, error } = await supabase
      .from("ticket_bookings")
      .select("*, tickets(*), events(*)")
      .in("status", ["BOOKED", "USED"])
      .order("payment_successful_timestamp", { ascending: false });
    if (error) throw error.message;
    return data;
  });

  // metric 1
  const totalRevenue = bookingsData?.reduce(
    (acc, booking) =>
      acc + booking.booked_count * (booking.tickets?.price || 0),
    0
  );

  // metric 2
  const uniqueCustomers = bookingsData
    ?.map((booking) => booking.user_id)
    .filter((value, index, array) => array.indexOf(value) === index).length;

  // metric 3
  const totalTicketsSold = bookingsData?.reduce(
    (acc, booking) => acc + booking.booked_count,
    0
  );

  // metric 4
  let repeatCustomerRate = 0;

  const repeatCustomerCount = bookingsData
    ?.map((booking) => booking.user_id)
    ?.reduce((acc: string[], userId, index, array) => {
      if (array.indexOf(userId) !== index && !acc.includes(userId)) {
        acc.push(userId);
      }
      return acc;
    }, []).length;

  const totalBookings = bookingsData?.length;

  if (totalBookings && uniqueCustomers && repeatCustomerCount) {
    repeatCustomerRate =
      totalBookings > 0
        ? Math.floor((repeatCustomerCount / uniqueCustomers) * 100)
        : 0;
  }

  if (isLoadingBookings || isLoadingEvents) {
    return (
      <div className="flex py-24 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    eventsData &&
    bookingsData && (
      <div>
        <div className="flex-col flex">
          <div className="flex-1 space-y-4 py-8">
            {/* Dasboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                {/* <CalendarDateRangePicker /> */}
                <Button onClick={() => exportBookingsToExcel(bookingsData)}>
                  Download
                </Button>
              </div>
            </div>

            {/* Tabs Filter */}
            <Tabs defaultValue="overview" className="space-y-4">
              {/* Tab - Overview */}
              <TabsContent
                value="overview"
                className="space-y-4 md:space-y-0 md:space-x-4 grid lg:grid-cols-3"
              >
                {/* grid 2/3 */}
                <div className="col-span-2 space-y-4">
                  {/* Metric Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Revenue
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ₹{convertNumbThousand(totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Cumulative amount collected
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Customers
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {convertNumbThousand(uniqueCustomers)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Unique ticket buyers
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sales
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {convertNumbThousand(totalTicketsSold)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total tickets sold
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Repeat Customer Rate
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {repeatCustomerRate}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Percentage of repeat buyers
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Chart */}
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview bookingsData={bookingsData} />
                    </CardContent>
                  </Card>
                </div>

                {/* grid 1/3 */}
                <div className="space-y-4">
                  {/* Latest Event Performance */}
                  <div className="col-span-1">
                    {/* Table */}
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Latest Event Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardCategoryCustom
                          taxonomy={eventsData[0]}
                          cta={false}
                        />
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full space-x-4">
                          <Link
                            href={`/organizer/dashboard/${eventsData[0].slug}`}
                            className="w-full"
                          >
                            <Button variant="outline" className="w-full">
                              Go to Event Analytics
                            </Button>
                          </Link>
                          <Link
                            href={`/events/${eventsData[0].slug}/join-chat`}
                            className="w-full"
                          >
                            <Button variant="default" className="w-full">
                              See Chatroom
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  {/* Table */}
                  <div className="col-span-1">
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>
                          You made {totalTicketsSold}{" "}
                          {totalTicketsSold === 1 ? "sale" : "sales"} for this
                          event.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RecentSales bookings={bookingsData.slice(0, 5)} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  );
}
