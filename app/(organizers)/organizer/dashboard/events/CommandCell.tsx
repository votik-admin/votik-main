import React from "react";

import {
  Copy,
  CopyPlus,
  Edit2,
  Eye,
  MoreHorizontal,
  QrCode,
  Scan,
  ScanQrCode,
  Trash,
  TrendingUp,
  MessageSquareText,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover";
import { Button } from "@app/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandList,
} from "@app/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@app/components/ui/dialog";
import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { EventWithTickets } from "./DataTable";
import {
  addTickets,
  createEvent,
  deleteEvent,
  getAllEventsByOrganizer,
} from "@app/queries";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";

export default function CommandCell({
  row,
  event,
}: {
  row: Row<EventWithTickets>;
  event?: EventWithTickets;
}) {
  const { mutate } = useSWRConfig();

  const [open, setOpen] = React.useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] =
    React.useState(false);
  const [showDuplicateEventDialog, setShowDuplicateEventDialog] =
    React.useState(false);

  const slug = row.getValue("slug");
  const id = row.getValue("id");
  const eventUrl = process.env.NEXT_PUBLIC_APP_URL! + "/events/" + slug;

  const handleDuplicateEvent = async () => {
    if (event) {
      const { tickets, id, created_at, ...eventWithoutTickets } = event;
      const newEvent = {
        ...eventWithoutTickets,
        name: `Copy of ${event.name}`,
        slug: `${event.slug}-copy`,
        accepted: false,
      };

      mutate(
        "getAllEventsByOrganizer",
        async () => {
          const { data: createdEventFromServer, error: createError } =
            await createEvent(newEvent);

          // createdEventFromServer[0].id
          if (createError) {
            toast.error(createError.message);
            throw createError;
          }

          const { data: addTicketsData, error: addTicketsError } =
            await addTickets(
              event.tickets.filter(Boolean).map((ticket) => ({
                // ! as ticket is not null
                name: ticket!.name,
                description: ticket!.description,
                price: ticket!.price,
                initial_available_count: ticket!.initial_available_count,
                current_available_count: ticket!.initial_available_count, // refresh current available count
                event_id: createdEventFromServer[0].id, // assign to newly created event
              }))
            );
          if (addTicketsError) {
            toast.error(addTicketsError.message);
            throw addTicketsError;
          }

          toast.success("Event created");

          const { data, error } = await getAllEventsByOrganizer(
            event.organizer_id!
          );
          if (error) {
            toast.error(error.message);
            throw error;
          }
          return data;
        },
        {
          optimisticData: (current?: EventWithTickets[]) => [
            {
              ...newEvent,
              id: "assigning...",
              created_at: new Date().toISOString(),
              tickets: [],
            },
            ...(current || []),
          ],
        }
      );
    }
  };

  const handleDeleteEvent = async () => {
    if (event) {
      mutate(
        "getAllEventsByOrganizer",
        async () => {
          const { error: deleteError } = await deleteEvent(event.id);
          if (deleteError) {
            toast.error(deleteError.message);
            throw deleteError;
          }
          toast.success("Event deleted");

          const { data, error } = await getAllEventsByOrganizer(
            event.organizer_id!
          );
          if (error) {
            toast.error(error.message);
            throw error;
          }
          return data;
        },
        {
          optimisticData: (data?: EventWithTickets[]) =>
            data?.filter((currentEvent) => currentEvent.id !== event.id) || [],
        }
      );
    }
  };

  return (
    <Dialog
      open={showDuplicateEventDialog}
      onOpenChange={setShowDuplicateEventDialog}
    >
      <Dialog
        open={showDeleteEventDialog}
        onOpenChange={setShowDeleteEventDialog}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {!!row.getValue("accepted") && (
                    <Link href={`/organizer/dashboard/${slug}`}>
                      <CommandItem>
                        <TrendingUp className="h-5 w-5" />
                        View analytics
                      </CommandItem>
                    </Link>
                  )}

                  {!!row.getValue("slug") && (
                    <Link href={`/events/${slug}/join-chat`}>
                      <CommandItem>
                        <MessageSquareText className="h-5 w-5" />
                        Join Chatroom
                      </CommandItem>
                    </Link>
                  )}
                  <Link href={`/scan/${slug}`}>
                    <CommandItem>
                      <QrCode className="h-5 w-5" />
                      Scan Ticket
                    </CommandItem>
                  </Link>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup>
                  <Link href={`/organizer/event/${id}/edit/1`}>
                    <CommandItem>
                      <Edit2 className="h-5 w-5" />
                      Edit
                    </CommandItem>
                  </Link>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setShowDuplicateEventDialog(true);
                      }}
                    >
                      <CopyPlus className="h-5 w-5" />
                      Duplicate
                    </CommandItem>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setShowDeleteEventDialog(true);
                      }}
                    >
                      <Trash className="h-5 w-5" />
                      Delete
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>

                {!!slug && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      {!!slug && (
                        <a href={eventUrl} target="_blank">
                          <CommandItem onSelect={() => setOpen(false)}>
                            <Eye className="h-5 w-5" />
                            Visit event page
                          </CommandItem>
                        </a>
                      )}
                      {!!slug && (
                        <CommandItem
                          onSelect={() => {
                            navigator.clipboard.writeText(eventUrl);
                            setOpen(false);
                          }}
                        >
                          <Copy className="h-5 w-5" />
                          Copy event URL
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Delete Event Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              event and associated tickets, bookings and related data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteEventDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteEvent();
                setShowDeleteEventDialog(false);
              }}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
        {/* Delete Event Dialog Ends */}
      </Dialog>

      {/* Duplicate Event Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate event "{row.getValue("name")}"?</DialogTitle>
          <DialogDescription>
            Event will be duplicated with tickets.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowDuplicateEventDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDuplicateEvent();
              setShowDuplicateEventDialog(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
