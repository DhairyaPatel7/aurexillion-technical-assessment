from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import case, or_
from sqlmodel import Session, select

from .auth import get_current_user
from .database import get_session
from .models import Ticket, utcnow
from .schemas import (
    TicketCreate,
    TicketPriority,
    TicketRead,
    TicketSort,
    TicketStatus,
    TicketUpdate,
)

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"],
    dependencies=[Depends(get_current_user)],
)


@router.get("", response_model=list[TicketRead])
def list_tickets(
    status: list[TicketStatus] | None = Query(default=None),
    priority: list[TicketPriority] | None = Query(default=None),
    search: str | None = Query(default=None, description="Match title or customer name"),
    sort: TicketSort = Query(default=TicketSort.newest),
    session: Session = Depends(get_session),
) -> list[TicketRead]:
    statement = select(Ticket)

    if status:
        statement = statement.where(Ticket.status.in_([item.value for item in status]))
    if priority:
        statement = statement.where(Ticket.priority.in_([item.value for item in priority]))
    if search and search.strip():
        term = f"%{search.strip()}%"
        statement = statement.where(
            or_(Ticket.title.ilike(term), Ticket.customer_name.ilike(term))
        )

    if sort is TicketSort.oldest:
        statement = statement.order_by(Ticket.created_at.asc())
    elif sort is TicketSort.priority:
        rank = case({"high": 3, "medium": 2, "low": 1}, value=Ticket.priority, else_=0)
        statement = statement.order_by(rank.desc(), Ticket.created_at.desc())
    else:
        statement = statement.order_by(Ticket.created_at.desc())

    tickets = session.exec(statement).all()
    return [TicketRead.from_ticket(ticket) for ticket in tickets]


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(ticket_id: int, session: Session = Depends(get_session)) -> TicketRead:
    ticket = session.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketRead.from_ticket(ticket)


@router.post("", response_model=TicketRead, status_code=201)
def create_ticket(payload: TicketCreate, session: Session = Depends(get_session)) -> TicketRead:
    ticket = Ticket(
        title=payload.title,
        description=payload.description,
        customer_name=payload.customerName,
        customer_email=payload.customerEmail,
        priority=payload.priority.value,
        status=TicketStatus.open.value,
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return TicketRead.from_ticket(ticket)


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(
    ticket_id: int,
    payload: TicketUpdate,
    session: Session = Depends(get_session),
) -> TicketRead:
    ticket = session.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")

    updates = payload.column_updates()
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    for column, value in updates.items():
        setattr(ticket, column, value)
    ticket.updated_at = utcnow()

    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return TicketRead.from_ticket(ticket)
