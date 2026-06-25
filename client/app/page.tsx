"use client";

import { useCallback, useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import TicketList from "@/components/TicketList";
import { ApiError, getTickets } from "@/lib/api";
import type { Ticket } from "@/lib/types";

type LoadState = "loading" | "error" | "ready";

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      setTickets(await getTickets());
      setState("ready");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="page-head">
        <h1>Tickets</h1>
      </div>

      {state === "loading" && <Spinner />}

      {state === "error" && (
        <div className="state state--error">
          <p className="state__title">Unable to load tickets</p>
          <p className="state__hint">{error}</p>
          <button type="button" className="button" onClick={() => void load()}>
            Try again
          </button>
        </div>
      )}

      {state === "ready" && <TicketList tickets={tickets} />}
    </div>
  );
}
