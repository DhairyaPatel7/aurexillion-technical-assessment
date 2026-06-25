import {
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
  type TicketFilters,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/types";

interface Props {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
}

export default function Filters({ filters, onChange }: Props) {
  return (
    <div className="filters">
      <div className="filters__field">
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={filters.status ?? ""}
          onChange={(event) =>
            onChange({ ...filters, status: (event.target.value || undefined) as TicketStatus })
          }
        >
          <option value="">All statuses</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__field">
        <label htmlFor="filter-priority">Priority</label>
        <select
          id="filter-priority"
          value={filters.priority ?? ""}
          onChange={(event) =>
            onChange({ ...filters, priority: (event.target.value || undefined) as TicketPriority })
          }
        >
          <option value="">All priorities</option>
          {PRIORITY_ORDER.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
