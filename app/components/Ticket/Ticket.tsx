import Badge from "@app/shared/Badge/Badge";
import "./Ticket.css";
import NcImage from "@app/shared/NcImage/NcImage";
import QRImage from "../QRImage/QRImage";

export default function Ticket({
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
      className="grid grid-cols-[1.5fr_0.4fr] p-8 bg-[#430D7F] rounded-md text-white w-fit h-fit relative small-font"
    >
      <div className="ticket-container after:bg-white after:dark:bg-neutral-800 before:bg-white before:dark:bg-neutral-800 grid grid-cols-[275px_275px] border-dashed border-r-2 gap-6 pr-10 relative border-gray-50">
        <div className="w-full h-full grid place-items-center">
          <NcImage
            src={ticket.imgSrc}
            alt="image"
            onLoad={(e) => {
              e.currentTarget.classList.remove("animate-pulse");
            }}
            className="animate-pulse rounded-md object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-between max-w-[300px] px-2">
          <div className="flex flex-col gap-2 items-start line-clamp-2 text-ellipsis">
            <Badge name="Music" className="small-font" />
            <p className="font-bold text-base leading-tight text-left">
              {ticket.name}
            </p>
          </div>
          <div className="flex justify-between ">
            <div className="text-left">
              <p className="text-gray-300">Date & Time</p>
              <p>{ticket.date}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300">Tickets</p>
              <p>{ticket.count}</p>
            </div>
          </div>
          <div className="flex justify-between ">
            <div className="text-left">
              <p className="text-gray-300">Venue</p>
              <p className="max-w-[80%]">{ticket.venue}</p>
            </div>
            {ticket.seats && (
              <div className="text-right">
                <p className="text-gray-300">Seats</p>
                <p>{ticket.seats.join(", ")}</p>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Total ({ticket.count})</p>
            <p>Rs. {ticket.price.toFixed(2)}</p>
          </div>
          <div className="flex justify-between ">
            <p>Convenience Fee</p>
            <p>Rs. {ticket.convenienceFree.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold bg-[#542290] py-2 px-3 rounded-md text-sm rounded-t-none">
            <p>Amount Paid</p>
            <p>Rs. {ticket.amount.toFixed(2) + " /-"}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center pl-10 w-full h-full">
        {/* <img
          style={{
            maxWidth: "unset",
          }}
          src="https://picsum.photos/300"
          alt="QR"
          className="rounded-md w-[200px] overflow-hidden"
        /> */}
        <QRImage
          width={200}
          height={200}
          className="rounded-md w-[200px] overflow-hidden"
          text={ticket.bookingId}
        />
        <p className="font-light text-center ">
          Booking ID: {ticket.bookingId}
        </p>
      </div>
    </div>
  );
}
