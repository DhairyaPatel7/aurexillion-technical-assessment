import type { Ticket } from "@/lib/types";

import TicketCard from "./TicketCard";

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="state">
        <span className="state__icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </span>
        <p className="state__title">No tickets found</p>
        <p className="state__hint">Try adjusting your search or filters, or create a new ticket.</p>
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
