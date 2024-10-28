import Badge from "@app/shared/Badge/Badge";
import "./Ticket.css";

export default function MobileTicket() {
  return (
    <div className="grid grid-rows-[1fr_1fr_auto] text-xs bg-[#430D7F] rounded-md text-white w-[350px] relative">
      <div className="ticket-section flex flex-col gap-6 border-b-2 border-dashed pb-10 pt-6 px-5 relative">
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          <img src="https://picsum.photos/300" alt="" className="rounded-md" />
          <div className="flex flex-col items-start gap-2 justify-between">
            <Badge name="Music" className="text-xs" />
            <p className="font-bold text-sm leading-relaxed justify-around">
              Arijit Singh - Monopoly Movies Album India Tour | Mumbai
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Date & Time</p>
            <p className="font-bold">12th Dec 2021, 7:00 PM</p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-gray-300">Tickets</p>
            <p className="font-bold">03</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-gray-300">Venue</p>
            <p className="font-bold max-w-[80%]">
              Dublin Square, Phoenix Marketcity, Mumbai
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-gray-300">Seats</p>
            <p className="font-bold max-w-[80%]">A1, A2, A3</p>
          </div>
        </div>
      </div>
      <div className="ticket-section flex flex-col items-center h-full w-full justify-center gap-4 py-10 px-5 border-dashed border-b-2 relative">
        <p className="font-light text-center ">Booking ID: VOTIK567890</p>
        <img
          style={{
            maxWidth: "unset",
          }}
          src="https://picsum.photos/300"
          alt="QR"
          className="rounded-md w-[200px]"
        />
        <p className="font-light text-center ">Scan QR at the venue</p>
      </div>
      <div className="flex flex-col gap-4 pt-10">
        <div className="flex justify-between px-5">
          <p className="font-medium">Total (3)</p>
          <p>Rs. 1500.00</p>
        </div>
        <div className="flex justify-between px-5">
          <p>Convenience Fee</p>
          <p>Rs. 25.00</p>
        </div>
        <div className="flex justify-between font-bold bg-[#542290] p-5 rounded-md text-sm rounded-t-none">
          <p>Amount Paid</p>
          <p>Rs. 1525.00</p>
        </div>
      </div>
    </div>
  );
}
