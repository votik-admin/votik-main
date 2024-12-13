"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Button } from "@app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/ui/tabs";
import { CalendarDateRangePicker } from "@app/(organizers)/organizer/dashboard/components/date-range-picker";
import { MainNav } from "@app/(organizers)/organizer/dashboard/components/main-nav";
import { Overview } from "@app/(organizers)/organizer/dashboard/components/overview";
import { RecentSales } from "@app/(organizers)/organizer/dashboard/components/recent-sales";
import { Search } from "@app/(organizers)/organizer/dashboard/components/search";
import TeamSwitcher from "@app/(organizers)/organizer/dashboard/components/team-switcher";
import { UserNav } from "@app/(organizers)/organizer/dashboard/components/user-nav";
import AnalyticsChart from "./AnalyticsChart";
import useSWR from "swr";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import AnalyticsTrends from "./AnalyticsTrends";
import Spinner from "@app/components/Spinner/Spinner";
import { exportBookingsToExcel } from "@app/utils/exportBookings";

export default function DashboardPage({
  organizer,
  slug,
}: {
  organizer: Tables<"organizers">;
  slug?: string;
}) {
  const [selectedTeam, setSelectedTeam] = React.useState<
    Tables<"events"> & { tickets: (Tables<"tickets"> | null)[] }
  >();

  const {
    data: eventsData,
    error: errorData,
    isLoading: isLoadingEvents,
  } = useSWR(
    "getAllEventsByOrganizer",
    async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, tickets(*)")
        .eq("organizer_id", organizer.id)
        .order("created_at", { ascending: false });
      if (error) throw error.message;
      return data;
    },
    {
      onSuccess: (events) => {
        if (slug) {
          setSelectedTeam(events.find((event) => event.slug === slug));
        } else if (!selectedTeam) {
          // start with the first accepted event
          setSelectedTeam(events.filter((event) => event.accepted)[0]);
        }
      },
    }
  );

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

  useEffect(() => {
    if (slug) {
      setSelectedTeam(eventsData?.find((event) => event.slug === slug));
    }
  }, [slug, eventsData]);

  // metric 1
  const totalRevenue = bookingsData
    ?.filter((booking) => booking.event_id === selectedTeam?.id)
    .reduce(
      (acc, booking) =>
        acc + booking.booked_count * (booking.tickets?.price || 0),
      0
    );

  // metric 2
  const uniqueCustomers = bookingsData
    ?.filter((booking) => booking.event_id === selectedTeam?.id)
    .map((booking) => booking.user_id)
    .filter((value, index, array) => array.indexOf(value) === index).length;

  // metric 3
  const totalTicketsSold = bookingsData
    ?.filter((booking) => booking.event_id === selectedTeam?.id)
    .reduce((acc, booking) => acc + booking.booked_count, 0);

  // metric 4
  let repeatCustomerRate = 0;

  const repeatCustomerCount = bookingsData
    ?.map((booking) => booking.user_id)
    .reduce((acc: string[], userId, index, array) => {
      if (array.indexOf(userId) !== index && !acc.includes(userId)) {
        acc.push(userId);
      }
      return acc;
    }, []).length;

  const totalBookings = bookingsData?.filter(
    (booking) => booking.event_id === selectedTeam?.id
  ).length;

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
              <h2 className="text-3xl font-bold tracking-tight">
                {selectedTeam?.name}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <TeamSwitcher
                  events={eventsData}
                  isLoadingEvents={isLoadingEvents}
                  selectedTeam={selectedTeam}
                  setSelectedTeam={setSelectedTeam}
                  slug={slug}
                />
                {/* <CalendarDateRangePicker /> */}
                <Button
                  onClick={() =>
                    exportBookingsToExcel(
                      bookingsData?.filter(
                        (booking) => booking.event_id === selectedTeam?.id
                      )
                    )
                  }
                >
                  Download
                </Button>
              </div>
            </div>

            {/* Tabs Filter */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                {/* <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger> */}
              </TabsList>

              {/* Tab - Overview */}
              <TabsContent value="overview" className="space-y-4">
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

                {/* Tickets Sold */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight pl-4">
                    Tickets Sold
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Do not map selecetedTeam.tickets instead as it won't be updated live on refetch */}
                    {eventsData
                      .find((event) => event.id === selectedTeam?.id)
                      ?.tickets?.map((ticket) => {
                        return (
                          ticket && (
                            <Card key={ticket.id}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  {ticket.name}
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
                                  <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="5"
                                    rx="2"
                                  />
                                  <path d="M2 10h20" />
                                </svg>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">
                                  {ticket.initial_available_count -
                                    ticket.current_available_count}
                                  {" / "}
                                  {ticket.initial_available_count}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {Math.floor(
                                    ((ticket.initial_available_count -
                                      ticket.current_available_count) /
                                      ticket.initial_available_count) *
                                      100
                                  )}
                                  % tickets sold
                                </p>
                              </CardContent>
                            </Card>
                          )
                        );
                      })}
                  </div>
                </div>

                {/* Chart & Table */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  {/* Chart */}
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview
                        bookingsData={bookingsData.filter(
                          (booking) => booking.event_id === selectedTeam?.id
                        )}
                      />
                    </CardContent>
                  </Card>
                  {/* Table */}
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
                      <RecentSales
                        bookings={bookingsData
                          .filter(
                            (booking) => booking.event_id === selectedTeam?.id
                          )
                          .slice(0, 5)}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab - Analytics */}
              <TabsContent value="analytics">
                {selectedTeam?.slug && (
                  <AnalyticsChart slug={selectedTeam?.slug} />
                )}
              </TabsContent>

              {/* Tab - Trends */}
              <TabsContent value="trends">
                {selectedTeam?.slug && (
                  <AnalyticsTrends slug={selectedTeam?.slug} />
                )}
              </TabsContent>

              {/* Add other tabs here */}
            </Tabs>
          </div>
        </div>
      </div>
    )
  );
}
