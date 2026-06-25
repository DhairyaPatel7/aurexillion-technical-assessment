import { STATUS_LABELS, type TicketStatus } from "@/lib/types";

export default function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`badge badge--status-${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
