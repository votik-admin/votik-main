"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import { cn } from "@app/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import { Button } from "@app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { Tables } from "@app/types/database.types";
import { useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  events: Tables<"events">[];
  isLoadingEvents: boolean;
}

export default function TeamSwitcher({ className, events }: TeamSwitcherProps) {
  const router = useRouter();

  const acceptedEvents = events.filter((event) => event.accepted);
  const notAcceptedEvents = events.filter((event) => !event.accepted);
  const groups = [
    { label: "Accepted", events: acceptedEvents },
    { label: "Not accepted", events: notAcceptedEvents },
  ];

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Tables<"events">>(
    groups[0].events[0]
  );
  console.log(events);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedTeam.primary_img || ""}
                alt={selectedTeam.name || ""}
                // className="grayscale"
              />
              <AvatarFallback>
                {selectedTeam.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .reduce((char, prev) => prev + char, "")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {selectedTeam.name}
            <ChevronsUpDown className="ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search event..." />
            <CommandList>
              <CommandEmpty>No event found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.events.map((event) => (
                    <CommandItem
                      key={event.id}
                      onSelect={() => {
                        setSelectedTeam(event);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={event.primary_img || ""}
                          alt={event.name || ""}
                          // className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {event.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedTeam.id === event.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      router.push("/organizer/add-event");
                    }}
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create Event
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  );
}
