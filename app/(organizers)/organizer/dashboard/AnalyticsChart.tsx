"use client";
import React, { useEffect, useState } from "react";
import * as protos from "@google-analytics/data/build/protos/protos";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";

import useSWR from "swr";
import Spinner from "@app/components/Spinner/Spinner";
import formatTime from "@app/utils/formatTime";

export type AnalyticsResponse = {
  data: protos.google.analytics.data.v1beta.IRunReportResponse | null;
  error: string | null;
  message: string | null;
};

const metrics = {
  activeUsers: {
    name: "Active Users",
    description: "Number of active users",
  },
  sessions: {
    name: "Sessions",
    description: "Number of sessions",
  },
  screenPageViews: {
    name: "Views",
    description: "Number of views",
  },
  screenPageViewsPerUser: {
    name: "Views Per User",
    description: "Average Views per User",
    formatter: (value: string) => Number(value).toFixed(2),
  },
  engagedSessions: {
    name: "Engaged Sessions",
    description:
      "The number of sessions that lasted longer than 10 seconds, or had a key event, or had 2 or more screen views",
  },
  bounceRate: {
    name: "Bounce Rate",
    description: "The percentage of sessions that were not engaged",
    formatter: (value: string) => `${Math.round(Number(value) * 100)}%`,
  },
  eventCount: {
    name: "Event Count",
    description:
      "Number of events (click, first_visit, form_start, form_submit, page_view, scroll, session_start, user_engagement)",
  },
  dauPerMau: {
    name: "DAU per MAU",
    description:
      "The rolling percent of 30-day active users who are also 1-day active users",
  },
  dauPerWau: {
    name: "DAU per WAU",
    description:
      "The rolling percent of 7-day active users who are also 1-day active users",
  },
  sessionsPerUser: {
    name: "Sessions per User",
    description: "The average number of sessions per user",
    formatter: (value: string) => Number(value).toFixed(2),
  },
  averageSessionDuration: {
    name: "Average Session Duration",
    description: "The average duration of users sessions",
    formatter: (value: string) => formatTime(Number(value)),
  },
  userEngagementDuration: {
    name: "User Engagement Duration",
    description:
      "The total amount of time your event was in the foreground of users` devices.",
    formatter: (value: string) => formatTime(Number(value)),
  },
} as Record<
  string,
  { name: string; description: string; formatter?: (value: string) => string }
>;

const AnalyticsChart = ({ slug }: { slug: string }) => {
  const dateRanges = [{ startDate: "2024-03-31", endDate: "today" }];
  // const eventSlug = "xroom-rasa";
  const eventSlug = slug;

  const [
    averageEngagementTimePerActiveUser,
    setAverageEngagementTimePerActiveUser,
  ] = useState("");
  const [activeUsers, setActiveUsers] = useState(1);

  const {
    data: dataAnalytics,
    error: errorAnalytics,
    isLoading: isLoadingAnalytics,
  } = useSWR(`getAnalytics-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          // { name: "newUsers" },
          { name: "screenPageViews" }, // views
          { name: "screenPageViewsPerUser" }, // views/users
          { name: "sessions" },
          { name: "engagedSessions" },
          { name: "bounceRate" },
          { name: "sessionsPerUser" },
          { name: "averageSessionDuration" },
          { name: "eventCount" },
          { name: "userEngagementDuration" }, // from
          // { name: "dauPerMau" },
          // { name: "dauPerWau" },
        ],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  useEffect(() => {
    const activeUsersIndex = dataAnalytics?.data?.metricHeaders?.findIndex(
      (metric) => metric.name === "activeUsers"
    );
    const userEngagementDurationIndex =
      dataAnalytics?.data?.metricHeaders?.findIndex(
        (metric) => metric.name === "userEngagementDuration"
      );

    if (
      typeof activeUsersIndex === "number" &&
      typeof userEngagementDurationIndex === "number"
    ) {
      const activeUsersActual = Number(
        dataAnalytics?.data?.rows?.[0]?.metricValues?.[activeUsersIndex].value
      );
      const userEngagementDuration = Number(
        dataAnalytics?.data?.rows?.[0]?.metricValues?.[
          userEngagementDurationIndex
        ].value
      );

      if (activeUsersActual && userEngagementDuration) {
        setAverageEngagementTimePerActiveUser(
          formatTime(userEngagementDuration / activeUsersActual)
        );
        setActiveUsers(activeUsersActual);
      }
    }
  }, [dataAnalytics]);

  if (isLoadingAnalytics) {
    return (
      <div className="flex py-24 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataAnalytics?.data &&
          Array.from({
            length: dataAnalytics?.data?.metricHeaders?.length || 0,
          }).map((_, i) => {
            const metric = dataAnalytics?.data?.metricHeaders?.[i]
              .name as keyof typeof metrics;
            const value =
              dataAnalytics?.data?.rows?.[0]?.metricValues?.[i].value || "";
            return (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metrics[metric].name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics[metric].formatter
                      ? metrics[metric].formatter(value)
                      : value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics[metric].description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        {/* Average engagement time per active user */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Engagement Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageEngagementTimePerActiveUser}
            </div>
            <p className="text-xs text-muted-foreground">
              Average engagement time per active user
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsChart;
