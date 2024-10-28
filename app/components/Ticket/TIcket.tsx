import Badge from "@app/shared/Badge/Badge";
import "./Ticket.css";

export default function Ticket() {
  return (
    <div className="grid grid-cols-[1.5fr_0.4fr] p-8 bg-[#430D7F] rounded-md text-white w-fit h-fit relative small-font">
      <div className="ticket-container grid grid-cols-[275px_275px] border-dashed border-r-2 gap-6 pr-10 relative">
        <div className="w-full h-full">
          <img
            src="https://picsum.photos/200"
            alt="image"
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-between max-w-[300px] px-2">
          <div className="flex flex-col gap-2 items-start">
            <Badge name="Music" className="small-font" />
            <p className="font-bold text-base leading-tight">
              Arijit Singh - Monopoly Movies Album India Tour | Mumbai
            </p>
          </div>
          <div className="flex justify-between ">
            <div className="text-left">
              <p className="text-gray-300">Date & Time</p>
              <p>12th Dec 2021, 7:00 PM</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300">Tickets</p>
              <p>03</p>
            </div>
          </div>
          <div className="flex justify-between ">
            <div className="text-left">
              <p className="text-gray-300">Venue</p>
              <p>Dublin Square, Phoenix Marketcity, Mumbai</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300">Seats</p>
              <p>A1, A2, A3</p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">Total (3)</p>
            <p>Rs. 1500.00</p>
          </div>
          <div className="flex justify-between ">
            <p>Convenience Fee</p>
            <p>Rs. 25.00</p>
          </div>
          <div className="flex justify-between font-bold bg-[#542290] py-2 px-3 rounded-md text-sm rounded-t-none">
            <p>Amount Paid</p>
            <p>Rs. 1525.00</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center pl-10 w-full h-full">
        <img
          style={{
            maxWidth: "unset",
          }}
          src="https://picsum.photos/300"
          alt="QR"
          className="rounded-md w-[200px]"
        />
        <p className="font-light text-center ">Booking ID: VOTIK567890</p>
      </div>
    </div>
  );
}
