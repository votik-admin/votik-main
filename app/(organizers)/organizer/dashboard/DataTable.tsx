"use client";

import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  CircleX,
  ArrowUp,
  ArrowDown,
  CircleCheck,
} from "lucide-react";

import { Button } from "@app/components/ui/button";
import { Checkbox } from "@app/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { Input } from "@app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import { Tables } from "@app/types/database.types";
import Link from "next/link";
import { ENUM_MAP } from "@app/types/hardcoded";
import BadgeDark from "@app/shared/Badge/BadgeDark";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";

type EventWithTickets = Tables<"events"> & {
  tickets: (Tables<"tickets"> | null)[];
};

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
      <>
        {col.key === "category" && row.getValue(col.key) && (
          <BadgeDark
            name={ENUM_MAP[row.getValue(col.key) as keyof typeof ENUM_MAP].name}
            color={
              ENUM_MAP[row.getValue(col.key) as keyof typeof ENUM_MAP].color
            }
          />
        )}
        {col.key === "accepted" && (
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
        {col.key !== "category" && col.key !== "accepted" && (
          <div>{row.getValue(col.key)}</div>
        )}
      </>
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
        {new Date(row.getValue(col.key)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  })),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const slug = row.getValue("slug");
      const id = row.getValue("id");
      const eventUrl = process.env.NEXT_PUBLIC_APP_URL! + "/events/" + slug;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {!!slug && (
              <DropdownMenuItem>
                <a href={eventUrl} target="_blank">
                  Visit event page
                </a>
              </DropdownMenuItem>
            )}
            {!!slug && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(eventUrl)}
              >
                Copy event URL
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {!!row.getValue("accepted") && (
              <Link href={`/organizer/dashboard/${slug}`}>
                <DropdownMenuItem>View analytics</DropdownMenuItem>
              </Link>
            )}
            <Link href={`/organizer/event/${id}/edit/1`}>
              <DropdownMenuItem>Edit event</DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem>Edit event</DropdownMenuItem> */}

            {/* Delete event */}
            <DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Delete event</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const DataTable = ({ data }: { data: EventWithTickets[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      slug: false,
      accepted: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      return columns.some((column) => {
        // Skip non-data columns like select and actions
        if (!("accessorKey" in column)) return false;

        const cellValue = String(
          row.getValue(column.accessorKey)
        ).toLowerCase();
        return cellValue.includes(searchValue);
      });
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder="Filter events..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl 2xl:max-w-max">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
