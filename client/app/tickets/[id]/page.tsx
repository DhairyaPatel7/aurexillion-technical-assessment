"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import BackLink from "@/components/BackLink";
import PriorityBadge from "@/components/PriorityBadge";
import Segmented from "@/components/Segmented";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/ToastProvider";
import { ApiError, getTicket, updateTicketStatus } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { STATUS_OPTIONS, type Ticket, type TicketStatus } from "@/lib/types";

type LoadState = "loading" | "error" | "notfound" | "ready";

export default function TicketDetailsPage() {
  const params = useParams<{ id: string }>();
  const ticketId = Number(params.id);
  const { showToast } = useToast();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      setTicket(await getTicket(ticketId));
      setState("ready");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setState("notfound");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setState("error");
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusChange(status: TicketStatus) {
    if (!ticket || status === ticket.status) return;
    setUpdating(true);
    try {
      setTicket(await updateTicketStatus(ticket.id, status));
      showToast("Status updated.", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not update the status.", "error");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <BackLink href="/">Back to tickets</BackLink>
      <div className="page-head">
        <h1>Ticket details</h1>
      </div>

      {state === "loading" && <Spinner />}

      {state === "notfound" && (
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
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <p className="state__title">Ticket not found</p>
          <p className="state__hint">It may have been removed, or the link is incorrect.</p>
          <Link href="/" className="button">
            Back to tickets
          </Link>
        </div>
      )}

      {state === "error" && (
        <div className="state state--error">
          <p className="state__title">Unable to load ticket</p>
          <p className="state__hint">{error}</p>
          <button type="button" className="button" onClick={() => void load()}>
            Try again
          </button>
        </div>
      )}

      {state === "ready" && ticket && (
        <article className="detail">
          <div className="detail__header">
            <div>
              <span className="detail__id">#{ticket.id}</span>
              <h2 className="detail__title">{ticket.title}</h2>
            </div>
            <PriorityBadge priority={ticket.priority} />
          </div>

          <div className="detail__status">
            <span className="detail__status-label">Status</span>
            <Segmented
              options={STATUS_OPTIONS}
              value={ticket.status}
              onChange={handleStatusChange}
              ariaLabel="Ticket status"
              disabled={updating}
            />
          </div>

          <dl className="detail__grid">
            <div>
              <dt>Customer</dt>
              <dd>{ticket.customerName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{ticket.customerEmail}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd className="mono">{formatDateTime(ticket.createdAt)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd className="mono">{formatDateTime(ticket.updatedAt)}</dd>
            </div>
          </dl>

          <div className="detail__description">
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>
        </article>
      )}
    </div>
  );
}
