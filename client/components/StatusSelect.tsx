import { STATUS_LABELS, STATUS_ORDER, type TicketStatus } from "@/lib/types";

interface Props {
  value: TicketStatus;
  onChange: (status: TicketStatus) => void;
  disabled?: boolean;
  id?: string;
}

export default function StatusSelect({ value, onChange, disabled, id = "status" }: Props) {
  return (
    <select
      id={id}
      className="status-select"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as TicketStatus)}
      aria-label="Ticket status"
    >
      {STATUS_ORDER.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
