import Badge from "@app/shared/Badge/Badge";
import "./Ticket.css";
import NcImage from "@app/shared/NcImage/NcImage";
import QRImage from "../QRImage/QRImage";

export default function MobileTicket({
  ticket,
}: {
  ticket: {
    imgSrc: string;
    name: string;
    date: string;
    count: number;
    venue: string;
    seats?: string[];
    price: number;
    convenienceFree: number;
    amount: number;
    bookingId: string;
  };
}) {
  return (
    <div
      style={{
        userSelect: "none",
      }}
      className="grid grid-rows-[1fr_1fr_auto] text-xs bg-[#430D7F] rounded-md text-white w-[350px] relative"
    >
      <div className="ticket-section after:bg-white after:dark:bg-neutral-800 before:bg-white before:dark:bg-neutral-800 flex flex-col gap-6 border-b-2 border-dashed pb-10 pt-6 px-5 relative">
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <NcImage
            src={ticket.imgSrc}
            alt=""
            onLoad={(e) => {
              e.currentTarget.classList.remove("animate-pulse");
            }}
            className="animate-pulse rounded-md"
          />
          <div className="flex flex-col items-start gap-2 justify-between">
            <Badge name="Music" className="text-xs" />
            <p className="font-bold text-sm leading-relaxed justify-around text-left">
              {ticket.name}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-left">
            <p className="text-gray-300">Date & Time</p>
            <p className="font-bold">{ticket.date}</p>
          </div>
          <div className="flex flex-col gap-1 text-right items-end">
            <p className="text-gray-300">Tickets</p>
            <p className="font-bold">{ticket.count}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-left">
            <p className="text-gray-300">Venue</p>
            <p className="font-bold max-w-[80%]">{ticket.venue}</p>
          </div>
          {ticket.seats && (
            <div className="flex flex-col gap-1 text-right items-end">
              <p className="text-gray-300">Seats</p>
              <p className="font-bold max-w-[80%]">{ticket.seats.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
      <div className="ticket-section after:bg-white after:dark:bg-neutral-800 before:bg-white before:dark:bg-neutral-800 flex flex-col items-center h-full w-full justify-center gap-4 py-10 px-5 border-dashed border-b-2 relative">
        <p className="font-light text-center ">
          Booking ID: {ticket.bookingId}
        </p>
        <QRImage
          width={200}
          height={200}
          className="rounded-md w-[200px]"
          text={ticket.bookingId}
        />
        <p className="font-light text-center ">Scan QR at the venue</p>
      </div>
      <div className="flex flex-col gap-4 pt-10">
        <div className="flex justify-between px-5">
          <p className="font-medium">Total ({ticket.count})</p>
          <p>Rs. {ticket.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-between px-5">
          <p>Convenience Fee</p>
          <p>Rs. {ticket.convenienceFree.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold bg-[#542290] p-5 rounded-md text-sm rounded-t-none">
          <p>Amount Paid</p>
          <p>Rs. {ticket.amount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
