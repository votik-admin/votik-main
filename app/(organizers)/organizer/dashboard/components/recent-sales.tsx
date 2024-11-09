import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import { Tables } from "@app/types/database.types";
import convertNumbThousand from "@app/utils/convertNumbThousand";
import getInitials from "@app/utils/getInitials";
import getTimeFromCurrentDate, {
  formatTimeLabel,
} from "@app/utils/getTimeFromCurrentDate";

export function RecentSales({
  bookings,
}: {
  bookings: (Tables<"ticket_bookings"> & {
    tickets: Tables<"tickets"> | null;
    events: Tables<"events"> | null;
  })[];
}) {
  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>
              {getInitials(booking.tickets?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.tickets?.name} ({booking.booked_count} * ₹
              {convertNumbThousand(booking.tickets?.price)})
            </p>
            <p className="text-sm text-muted-foreground">
              {formatTimeLabel(
                new Date(booking.payment_successful_timestamp!),
                new Date().getTime() -
                  new Date(booking.payment_successful_timestamp!).getTime()
              )}{" "}
              (
              {booking.payment_successful_timestamp &&
                getTimeFromCurrentDate(
                  new Date(booking.payment_successful_timestamp)
                )}
              )
            </p>
          </div>
          <div className="ml-auto font-medium">
            +₹
            {convertNumbThousand(
              booking.booked_count * (booking.tickets?.price || 0)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
