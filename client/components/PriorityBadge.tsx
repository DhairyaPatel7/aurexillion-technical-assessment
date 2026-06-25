import { PRIORITY_LABELS, type TicketPriority } from "@/lib/types";

export default function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`badge badge--priority-${priority}`}>{PRIORITY_LABELS[priority]}</span>
  );
}
