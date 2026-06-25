import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { Ticket } from "@/lib/types";

import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link href={`/tickets/${ticket.id}`} className="ticket-card">
      <div className="ticket-card__main">
        <div className="ticket-card__heading">
          <span className="ticket-card__id">#{ticket.id}</span>
          <h3 className="ticket-card__title">{ticket.title}</h3>
        </div>
        <p className="ticket-card__customer">{ticket.customerName}</p>
      </div>
      <div className="ticket-card__meta">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <span className="ticket-card__date">{formatDate(ticket.createdAt)}</span>
      </div>
    </Link>
  );
}
