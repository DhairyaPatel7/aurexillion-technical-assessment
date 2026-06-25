import BackLink from "@/components/BackLink";
import TicketForm from "@/components/TicketForm";

export default function NewTicketPage() {
  return (
    <div>
      <BackLink href="/">Back to tickets</BackLink>
      <div className="page-head">
        <h1>New ticket</h1>
      </div>
      <TicketForm />
    </div>
  );
}
