"use client";

import Spinner from "@app/components/Spinner/Spinner";
import supabase from "@app/lib/supabase";
import { Tables } from "@app/types/database.types";
import React from "react";
import useSWR, { mutate } from "swr";
import DataTable, { EventWithTickets } from "./DataTable";
import { Checkbox } from "@app/components/ui/checkbox";

import { ENUM_MAP } from "@app/types/hardcoded";
import BadgeDark from "@app/shared/Badge/BadgeDark";
import CommandCell from "./CommandCell";
import { Column, ColumnDef, Row } from "@tanstack/react-table";

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  QrCode,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@app/components/ui/button";
import { deleteEvents, getAllEventsByOrganizer } from "@app/queries";
import toast from "react-hot-toast";
import Link from "next/link";

const RenderDataTable = ({
  organizer,
}: {
  organizer: Tables<"organizers">;
}) => {
  const { data, error, isLoading } = useSWR(
    "getAllEventsByOrganizer",
    async () => {
      const { data, error } = await getAllEventsByOrganizer(organizer.id);
      if (error) throw error.message;
      return data;
    }
  );

  const columns: ColumnDef<EventWithTickets>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => {
        // intentional 1,2,3 to specify order while sorting
        if (!row.accepted) return "3_Pending";
        return new Date(row.start_time as string) < new Date()
          ? "2_Expired"
          : "1_Live";
      },
      header: ({ column }: { column: Column<EventWithTickets, unknown> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="space-x-2"
          >
            <span>Status</span>
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : (
                <ArrowDown />
              )
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-4">
          {row.getValue("accepted") ? (
            new Date(row.getValue("start_time")) < new Date() ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0"></div>
                <span>Expired</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                <span>Live</span>
              </div>
            )
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
              <span>Pending</span>
            </div>
          )}
        </div>
      ),
    },
    ...[
      { key: "accepted", value: "Accepted" },
      { key: "id", value: "Id" },
      { key: "slug", value: "Slug" },
      { key: "name", value: "Name" },
      { key: "city", value: "City" },
      { key: "location", value: "Location" },
      { key: "category", value: "Category" },
      { key: "expected_footfall", value: "Footfall" },
    ].map((col) => ({
      accessorKey: col.key,
      header: ({ column }: { column: Column<EventWithTickets, unknown> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="space-x-2"
          >
            <span>{col.value}</span>
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : (
                <ArrowDown />
              )
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }: { row: Row<EventWithTickets> }) => (
        <div>
          {!!(col.key === "category" && row.getValue(col.key)) && (
            <BadgeDark
              name={
                ENUM_MAP[row.getValue(col.key) as keyof typeof ENUM_MAP].name
              }
              color={
                ENUM_MAP[row.getValue(col.key) as keyof typeof ENUM_MAP].color
              }
            />
          )}
          {!!(col.key === "accepted") && (
            <div className="ml-4">
              {row.getValue("accepted") ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                  <span>True</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
                  <span>False</span>
                </div>
              )}
            </div>
          )}
          {!!(col.key !== "category" && col.key !== "accepted") && (
            <div>{row.getValue(col.key)}</div>
          )}
        </div>
      ),
    })),
    ...[
      { key: "created_at", value: "Created at" },
      { key: "start_time", value: "Start time" },
    ].map((col) => ({
      accessorKey: col.key,
      header: ({ column }: { column: Column<EventWithTickets, unknown> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="space-x-2"
          >
            <span>{col.value}</span>
            {column.getIsSorted() ? (
              column.getIsSorted() === "asc" ? (
                <ArrowUp />
              ) : (
                <ArrowDown />
              )
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }: { row: Row<EventWithTickets> }) => (
        <div>
          {col.key === "start_time"
            ? new Date(row.getValue(col.key)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : new Date(row.getValue(col.key)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </div>
      ),
    })),
    {
      id: "analytics",
      enableHiding: false,
      cell: ({ row }) =>
        row.getValue("accepted") ? (
          <Link href={`/organizer/dashboard/${row.getValue("slug")}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <TrendingUp className="h-5 w-5" />
              <span className="sr-only">View Analytics</span>
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
            <TrendingUp className="h-5 w-5" />
            <span className="sr-only">View Analytics</span>
          </Button>
        ),
    },
    {
      id: "chat",
      enableHiding: false,
      cell: ({ row }) =>
        row.getValue("slug") ? (
          <Link href={`/events/${row.getValue("slug")}/join-chat`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MessageSquareText className="h-5 w-5" />
              <span className="sr-only">Join Chatroom</span>
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
            <MessageSquareText className="h-5 w-5" />
            <span className="sr-only">Join Chatroom</span>
          </Button>
        ),
    },
    {
      id: "scan",
      enableHiding: false,
      cell: ({ row }) =>
        row.getValue("slug") ? (
          <Link href={`/scan/${row.getValue("slug")}`}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <QrCode className="h-5 w-5" />
              <span className="sr-only">Scan Ticket</span>
            </Button>
          </Link>
        ) : (
          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
            <QrCode className="h-5 w-5" />
            <span className="sr-only">Scan Ticket</span>
          </Button>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <CommandCell
          row={row}
          event={data?.filter((event) => event.id === row.getValue("id"))[0]}
        />
      ),
    },
  ];

  const handleDeleteSelected = (rows: Row<EventWithTickets>[]) => {
    const ids = rows.map((row) => row.getValue("id") as string);
    rows.forEach((row) => row.toggleSelected(false));

    mutate(
      "getAllEventsByOrganizer",
      async () => {
        const { error: deleteError } = await deleteEvents(ids);
        if (deleteError) {
          toast.error(deleteError.message);
          throw deleteError;
        }
        toast.success("Events deleted");

        const { data, error } = await getAllEventsByOrganizer(organizer.id);
        if (error) {
          toast.error(error.message);
          throw error;
        }
        return data;
      },
      {
        optimisticData: (data?: EventWithTickets[]) =>
          data?.filter((currentEvent) => !ids.includes(currentEvent.id)) || [],
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex py-24 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {data && (
        <DataTable
          data={data}
          columns={columns}
          handleDeleteSelected={handleDeleteSelected}
        />
      )}
    </div>
  );
};

export default RenderDataTable;
