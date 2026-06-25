"use client";

import { useCallback, useEffect, useState } from "react";

import Filters from "@/components/Filters";
import Spinner from "@/components/Spinner";
import TicketList from "@/components/TicketList";
import { ApiError, getTickets } from "@/lib/api";
import type { Ticket, TicketFilters } from "@/lib/types";

type LoadState = "loading" | "error" | "ready";

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [searchText, setSearchText] = useState("");
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchText.trim() || undefined }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const load = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      setTickets(await getTickets(filters));
      setState("ready");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setState("error");
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="page-head">
        <h1>Tickets</h1>
      </div>

      <div className="controls">
        <input
          type="search"
          className="search-input"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by title or customer"
          aria-label="Search tickets"
        />
        <Filters filters={filters} onChange={setFilters} />
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
