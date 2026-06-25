import type { Ticket } from "@/lib/types";

import TicketCard from "./TicketCard";

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="state">
        <p className="state__title">No tickets found</p>
        <p className="state__hint">Try adjusting your filters, or create a new ticket.</p>
      </div>
    );
  }

  return (
    <ul className="ticket-list">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <TicketCard ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}
