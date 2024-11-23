"use client";
import React, { useEffect, useState } from "react";
import * as protos from "@google-analytics/data/build/protos/protos";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@app/components/ui/chart";

import { Separator } from "@app/components/ui/separator";
import useSWR from "swr";
import Spinner from "@app/components/Spinner/Spinner";
import getTimeFromCurrentDate, {
  formatTimeLabel,
} from "@app/utils/getTimeFromCurrentDate";
import formatTime from "@app/utils/formatTime";
import { capitalize } from "@app/utils/capitalize";

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

const AnalyticsTrends = ({ slug }: { slug: string }) => {
  const dateRanges = [{ startDate: "2024-03-31", endDate: "today" }];
  // const eventSlug = "xroom-rasa";
  const eventSlug = slug;

  const {
    data: dataUsersByCity,
    error: errorUsersByCity,
    isLoading: isLoadingUsersByCity,
  } = useSWR(`getUsersByCity-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        dimensions: [{ name: "city" }],
        metrics: [{ name: "activeUsers" }],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  const {
    data: dataUsersByBrowser,
    error: errorUsersByBrowser,
    isLoading: isLoadingUsersByBrowser,
  } = useSWR(`getUsersByBrowser-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        dimensions: [{ name: "browser" }],
        metrics: [{ name: "activeUsers" }],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  const {
    data: dataUsersByDeviceCategory,
    error: errorUsersByDeviceCategory,
    isLoading: isLoadingUsersByDeviceCategory,
  } = useSWR(`getUsersByDeviceCategory-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        dimensions: [
          {
            name: "deviceCategory",
          },
        ],
        metrics: [{ name: "activeUsers" }],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  const {
    data: dataUsersByChannel,
    error: errorUsersByChannel,
    isLoading: isLoadingUsersByChannel,
  } = useSWR(`getUsersByChannel-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        dimensions: [
          {
            name: "firstUserPrimaryChannelGroup",
          },
        ],
        metrics: [{ name: "activeUsers" }],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  // deviceCategory, deviceModel
  // mobileDeviceBranding, mobileDeviceMarketingName, mobileDeviceModel
  // platformDeviceCategory
  const {
    data: dataUsersByDeviceBranding,
    error: errorUsersByDeviceBranding,
    isLoading: isLoadingUsersByDeviceBranding,
  } = useSWR(`getUsersByDeviceBranding-${eventSlug}`, () =>
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        dateRanges,
        dimensions: [{ name: "mobileDeviceBranding" }],
        metrics: [{ name: "activeUsers" }],
        eventSlug,
      }),
    }).then((res) => res.json() as Promise<AnalyticsResponse>)
  );

  const {
    data: dataUsersByDate,
    error: errorUsersByDate,
    isLoading: isLoadingUsersByDate,
  } = useSWR(
    `getUsersByDate-${eventSlug}`,
    () =>
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          dateRanges,
          dimensions: [{ name: "day" }, { name: "month" }, { name: "year" }],
          metrics: [{ name: "activeUsers" }],
          eventSlug,
        }),
      }).then((res) => res.json() as Promise<AnalyticsResponse>),
    {
      onSuccess: (dataUsersByDate) => {
        dataUsersByDate.data?.rows?.forEach((row, i) => {
          if (i !== 0) {
            if (row.metricValues?.[0].value) {
              row.metricValues[0].value = (
                Number(row.metricValues?.[0].value) +
                Number(
                  dataUsersByDate.data?.rows?.[i - 1]?.metricValues?.[0].value
                )
              ).toString();
            }
          }
        });
      },
    }
  );

  const {
    data: dataUsersByViews,
    error: errorUsersByViews,
    isLoading: isLoadingUsersByViews,
  } = useSWR(
    `getUsersByViews-${eventSlug}`,
    () =>
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({
          dateRanges,
          dimensions: [{ name: "day" }, { name: "month" }, { name: "year" }],
          metrics: [{ name: "screenPageViews" }],
          eventSlug,
        }),
      }).then((res) => res.json() as Promise<AnalyticsResponse>),
    {
      onSuccess: (dataUsersByViews) => {
        dataUsersByViews.data?.rows?.forEach((row, i) => {
          if (i !== 0) {
            if (row.metricValues?.[0].value) {
              row.metricValues[0].value = (
                Number(row.metricValues?.[0].value) +
                Number(
                  dataUsersByViews.data?.rows?.[i - 1]?.metricValues?.[0].value
                )
              ).toString();
            }
          }
        });
      },
    }
  );

  if (
    isLoadingUsersByCity ||
    isLoadingUsersByBrowser ||
    isLoadingUsersByChannel ||
    isLoadingUsersByDeviceBranding ||
    isLoadingUsersByDeviceCategory ||
    isLoadingUsersByDate
  ) {
    return (
      <div className="flex py-24 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="chart-wrapper mx-auto flex flex-col flex-wrap items-start justify-center gap-6 sm:flex-row">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card className="max-w-md" x-chunk="charts-01-chunk-7">
          <CardHeader>
            <CardTitle>Active users</CardTitle>
            <CardDescription>
              Track how total users accumulate over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer
              config={{
                value: {
                  label: "Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <AreaChart
                accessibilityLayer
                data={dataUsersByDate?.data?.rows?.map((data, index) => ({
                  key:
                    data.dimensionValues?.[0].value +
                    "-" +
                    data.dimensionValues?.[1].value +
                    "-" +
                    data.dimensionValues?.[2].value,
                  value: Number(data.metricValues?.[0].value),
                }))}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="key" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-value)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-value)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-value)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="value" />}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1">
          <CardHeader>
            <CardTitle>Views</CardTitle>
            <CardDescription>
              Track how total views accumulate over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <ChartContainer
              config={{
                resting: {
                  label: "Views",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full"
            >
              <LineChart
                accessibilityLayer
                margin={{
                  left: 14,
                  right: 14,
                  top: 10,
                }}
                // MM-DD-YYYY format
                // hence 1,0,2 instead of 0,1,2
                data={dataUsersByViews?.data?.rows?.map((data, index) => ({
                  date:
                    data.dimensionValues?.[1].value +
                    "-" +
                    data.dimensionValues?.[0].value +
                    "-" +
                    data.dimensionValues?.[2].value,
                  resting: Number(data.metricValues?.[0].value),
                }))}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.5}
                />
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });
                  }}
                />
                <Line
                  dataKey="resting"
                  type="natural"
                  fill="var(--color-resting)"
                  stroke="var(--color-resting)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    fill: "var(--color-resting)",
                    stroke: "var(--color-resting)",
                    r: 4,
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                  cursor={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6 lg:max-w-[25rem]">
        <Card className="max-w-xs lg:max-w-md w-full">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              {/* See firstUserPrimaryChannelGroup in */}
              {/* https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions */}
              Track how many users are coming from Direct Search, Organic
              Search, Paid Social, Organic Social, Email, Affiliates, Referral
              or Paid Search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={Object.fromEntries(
                (dataUsersByChannel?.data?.rows || [])?.map((data, index) => [
                  data.dimensionValues?.[0].value,
                  {
                    label: capitalize(data.dimensionValues?.[0].value),
                    color: `hsl(var(--chart-${(index + 1) % 6}))`,
                  },
                ])
              )}
              className="mx-auto aspect-square h-[300px] w-full"
            >
              <PieChart>
                <Pie
                  data={dataUsersByChannel?.data?.rows?.map((data, index) => ({
                    key: data?.dimensionValues?.[0].value,
                    value: Number(data.metricValues?.[0].value),
                    label: data.metricValues?.[0].value,
                    fill: `hsl(var(--chart-${(index + 1) % 6}))`,
                  }))}
                  nameKey="key"
                  dataKey="value"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs lg:max-w-md w-full">
          <CardHeader>
            <CardTitle>Geographic Location</CardTitle>
            <CardDescription>
              Track where users are visitng your event page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                move: {
                  label: "Move",
                  color: "hsl(var(--chart-1))",
                },
                stand: {
                  label: "Stand",
                  color: "hsl(var(--chart-2))",
                },
                exercise: {
                  label: "Exercise",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="w-full max-w-xs"
              style={{
                height: `${(dataUsersByCity?.data?.rows?.length || 0) * 2}rem`,
              }}
            >
              <BarChart
                margin={{
                  left: 36,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={dataUsersByCity?.data?.rows?.map((data, index) => ({
                  key: data?.dimensionValues?.[0].value,
                  value: Number(data.metricValues?.[0].value),
                  label: data.metricValues?.[0].value,
                  fill: `hsl(var(--chart-${(index + 1) % 6}))`,
                }))}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="key"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid w-full flex-1 gap-6">
        <Card
          className="max-w-xs lg:max-w-md w-full"
          x-chunk="charts-01-chunk-5"
        >
          <CardHeader>
            <CardTitle>Platform metrics</CardTitle>
            <CardDescription>
              Breakdown of how many users are visiting the event page from
              mobile v/s desktop v/s tablet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="grid items-center gap-2">
              {dataUsersByDeviceCategory?.data?.rows?.map((data, index) => (
                <div key={index} className="grid flex-1 auto-rows-min gap-0.5">
                  <div className="text-sm text-muted-foreground capitalize">
                    {data.dimensionValues?.[0].value}
                  </div>
                  <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                    {data.metricValues?.[0].value}
                    <span className="text-sm font-normal text-muted-foreground">
                      users
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <ChartContainer
              config={Object.fromEntries(
                (dataUsersByDeviceCategory?.data?.rows || [])?.map(
                  (data, index) => [
                    data.dimensionValues?.[0].value,
                    {
                      label: capitalize(data.dimensionValues?.[0].value),
                      color: `hsl(var(--chart-${(index + 1) % 6}))`,
                    },
                  ]
                )
              )}
              className="mx-auto aspect-square w-full max-w-[80%]"
            >
              <RadialBarChart
                margin={{
                  left: -10,
                  right: -10,
                  top: -10,
                  bottom: -10,
                }}
                data={dataUsersByDeviceCategory?.data?.rows?.map(
                  (data, index) => ({
                    key: data.dimensionValues?.[0].value,
                    value: data.metricValues?.[0].value,
                    fill: `hsl(var(--chart-${(index + 1) % 6}))`,
                  })
                )}
                innerRadius="20%"
                barSize={24}
                startAngle={90}
                endAngle={450}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="key" hideLabel />}
                />
                <PolarAngleAxis
                  type="number"
                  // domain={[0, activeUsers]}
                  dataKey="value"
                  tick={false}
                />
                <RadialBar dataKey="value" background cornerRadius={5} />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs lg:max-w-md w-full">
          <CardHeader>
            <CardTitle>Browser metrics</CardTitle>
            <CardDescription>
              Track where users are visitng your event page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                move: {
                  label: "Move",
                  color: "hsl(var(--chart-1))",
                },
                stand: {
                  label: "Stand",
                  color: "hsl(var(--chart-2))",
                },
                exercise: {
                  label: "Exercise",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="w-full"
              style={{
                height: `${
                  (dataUsersByBrowser?.data?.rows?.length || 0) * 3
                }rem`,
              }}
            >
              <BarChart
                className=""
                margin={{
                  left: 12,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={dataUsersByBrowser?.data?.rows?.map((data, index) => ({
                  key: data?.dimensionValues?.[0].value,
                  value: Number(data.metricValues?.[0].value),
                  label: data.metricValues?.[0].value,
                  fill: `hsl(var(--chart-${(index + 1) % 6}))`,
                }))}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="key"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="max-w-xs lg:max-w-md w-full">
          <CardHeader>
            <CardTitle>Device Category</CardTitle>
            <CardDescription>
              Manufacturer or branded name of user's device.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 p-4 pb-2">
            <ChartContainer
              config={{
                move: {
                  label: "Move",
                  color: "hsl(var(--chart-1))",
                },
                stand: {
                  label: "Stand",
                  color: "hsl(var(--chart-2))",
                },
                exercise: {
                  label: "Exercise",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="w-full"
              style={{
                height: `${
                  (dataUsersByDeviceBranding?.data?.rows?.length || 0) * 2
                }rem`,
              }}
            >
              <BarChart
                className=""
                margin={{
                  left: 12,
                  right: 0,
                  top: 0,
                  bottom: 10,
                }}
                data={dataUsersByDeviceBranding?.data?.rows?.map(
                  (data, index) => ({
                    key: data?.dimensionValues?.[0].value,
                    value: Number(data.metricValues?.[0].value),
                    label: data.metricValues?.[0].value,
                    fill: `hsl(var(--chart-${(index + 1) % 6}))`,
                  })
                )}
                layout="vertical"
                barSize={32}
                barGap={2}
              >
                <XAxis type="number" dataKey="value" hide />
                <YAxis
                  dataKey="key"
                  type="category"
                  tickLine={false}
                  tickMargin={4}
                  axisLine={false}
                  className="capitalize"
                />
                <Bar dataKey="value" radius={5}>
                  <LabelList
                    position="insideLeft"
                    dataKey="label"
                    fill="white"
                    offset={8}
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTrends;
