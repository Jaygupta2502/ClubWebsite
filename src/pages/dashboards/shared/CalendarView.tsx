import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Loader2, Sun, Moon, Search, X, MapPin, Clock, Users, Plus } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  status: "final_approved" | "pending" | "rejected" | string;
  club?: string;
  venue?: string;
  attendees?: number;
};

const clubColors: Record<string, string> = {
  "Technical Club": "#4f46e5",
  "Cultural Club": "#db2777",
  "Sports Club": "#16a34a",
  "Arts Club": "#fb923c",
};

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedClub, setSelectedClub] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isDark, setIsDark] = useState(false);

  // Event details modal
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Create event modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDate, setCreateDate] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    club: "",
    startTime: "",
    endTime: "",
    venue: "",
  });

  // -------- Fetch events from backend for a given month/year --------
  const fetchEvents = async (date: Date) => {
    try {
      setLoading(true);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const res = await fetch(`${API}/api/events/calendar?month=${month}&year=${year}`);
      const data = await res.json();

      const formatted: CalendarEvent[] = data.map((event: any) => ({
        id: event._id || `${event.date}-${event.title}`,
        title: event.title,
        start: event.date,
        end: event.endDate,
        status: event.status,
        club: event.club,
        venue: event.venue,
        attendees: event.attendees,
      }));

      setEvents(formatted);
    } catch (error) {
      console.error("❌ Error fetching events for calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate);
  }, []);

  const handleDatesSet = (arg: any) => {
    const newDate = new Date(arg.start);
    setCurrentDate(newDate);
    fetchEvents(newDate);
  };

  // -------- Filtering (club + search) --------
  const filteredEvents = events.filter((event) => {
    const matchesClub = selectedClub === "all" || event.club === selectedClub;

    if (!searchQuery.trim()) return matchesClub;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      event.title.toLowerCase().includes(q) ||
      (event.club || "").toLowerCase().includes(q) ||
      (event.venue || "").toLowerCase().includes(q);

    return matchesClub && matchesSearch;
  });

  // -------- Event click → show details modal --------
  const handleEventClick = (info: any) => {
    const found = events.find((ev) => ev.id === info.event.id);
    if (found) {
      setActiveEvent(found);
      setIsEventModalOpen(true);
    }
  };

  // -------- Date click → open create event modal --------
  const handleDateClick = (info: any) => {
    setCreateDate(info.dateStr);
    setCreateForm({
      title: "",
      club: "",
      startTime: "",
      endTime: "",
      venue: "",
    });
    setIsCreateModalOpen(true);
  };

  // -------- Frontend-only drag & drop / resize (no backend yet) --------
  const handleEventDrop = (info: any) => {
    const { id } = info.event;
    const newStart = info.event.start?.toISOString().slice(0, 10) || "";
    const newEnd = info.event.end?.toISOString().slice(0, 10) || undefined;

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              start: newStart,
              end: newEnd,
            }
          : ev
      )
    );

    // TODO: call backend to persist reschedule
    // await fetch(`${API}/api/events/${id}/reschedule`, { method: "PATCH", body: JSON.stringify({ start: newStart, end: newEnd }) });
  };

  const handleEventResize = (info: any) => {
    const { id } = info.event;
    const newEnd = info.event.end?.toISOString().slice(0, 10) || undefined;

    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              end: newEnd,
            }
          : ev
      )
    );

    // TODO: call backend to persist duration change
  };

  // -------- Create Event (frontend only) --------
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createDate) return;

    const newEvent: CalendarEvent = {
      id: `temp-${Date.now()}`,
      title: createForm.title || "Untitled Event",
      start: createDate,
      end: createDate,
      status: "pending",
      club: createForm.club || "Unassigned",
      venue: createForm.venue,
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsCreateModalOpen(false);

    // TODO: call backend to actually create the event
    // await fetch(`${API}/api/events/create`, { method: "POST", body: JSON.stringify({...}) });
  };

  // -------- Event color & tooltip styling --------
  const getStatusColor = (status: string) => {
    switch (status) {
      case "final_approved":
      case "approved":
        return "#22c55e";
      case "pending":
        return "#eab308";
      case "rejected":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleEventDidMount = (info: any) => {
    const status = info.event.extendedProps.status as string;
    const club = info.event.extendedProps.club as string | undefined;
    const venue = info.event.extendedProps.venue as string | undefined;

    const statusColor = getStatusColor(status);
    const clubColor = clubColors[club || ""] || "#0ea5e9";

    const el = info.el as HTMLElement;
    el.style.backgroundColor = statusColor;
    el.style.color = "white";
    el.style.borderRadius = "6px";
    el.style.borderLeft = `4px solid ${clubColor}`;
    el.style.paddingLeft = "6px";

    const title = info.event.title;
    el.title = `${title}\nClub: ${club || "N/A"}\nStatus: ${status}\nVenue: ${
      venue || "N/A"
    }`;
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top bar: title, search, filters, theme toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <span role="img" aria-label="calendar">
                📅
              </span>
              Campus Events Calendar
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View, explore and schedule events across all clubs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, clubs, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-8 pr-3 py-2 rounded-full border text-sm outline-none transition shadow-sm ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              />
            </div>

            {/* Club Filter */}
            <select
              className={`px-3 py-2 rounded-full border text-sm shadow-sm outline-none ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            >
              <option value="all">All Clubs</option>
              <option value="Technical Club">Technical Club</option>
              <option value="Cultural Club">Cultural Club</option>
              <option value="Sports Club">Sports Club</option>
              <option value="Arts Club">Arts Club</option>
            </select>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full border shadow-sm transition ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-yellow-400" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  Dark
                </>
              )}
            </button>

            {/* Quick add button (opens create modal) */}
            <button
              onClick={() => {
                setCreateDate(new Date().toISOString().slice(0, 10));
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
            >
              <Plus className="w-4 h-4" />
              Quick Event
            </button>
          </div>
        </div>

        {/* Calendar Card */}
        <div
          className={`rounded-2xl shadow-lg border ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          } p-4 md:p-6`}
        >
          {loading && (
            <div className="flex justify-center items-center mb-4">
              <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
            </div>
          )}

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="80vh"
            events={filteredEvents}
            datesSet={handleDatesSet}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            selectable
            editable
            dayMaxEvents
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventDidMount={handleEventDidMount}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {isEventModalOpen && activeEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-xl p-6 relative ${
              isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-2">{activeEvent.title}</h2>
            <p className="text-sm text-slate-500 mb-4">
              {activeEvent.status === "final_approved"
                ? "Approved Event"
                : activeEvent.status.charAt(0).toUpperCase() +
                  activeEvent.status.slice(1)}
            </p>

            <div className="space-y-3 text-sm">
              {activeEvent.club && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span>
                    <span className="font-medium">Club:</span> {activeEvent.club}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>
                  <span className="font-medium">Date:</span> {activeEvent.start}
                  {activeEvent.end && activeEvent.end !== activeEvent.start
                    ? ` → ${activeEvent.end}`
                    : ""}
                </span>
              </div>

              {activeEvent.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>
                    <span className="font-medium">Venue:</span> {activeEvent.venue}
                  </span>
                </div>
              )}

              {activeEvent.attendees && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>
                    <span className="font-medium">Expected Attendees:</span>{" "}
                    {activeEvent.attendees}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="px-4 py-2 rounded-full text-sm bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal (frontend-only stub) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-xl p-6 relative ${
              isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
            }`}
          >
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Schedule New Event
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-slate-100"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Club</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-slate-100"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  value={createForm.club}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, club: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-slate-100"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  value={createDate || ""}
                  onChange={(e) => setCreateDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Start Time</label>
                  <input
                    type="time"
                    className={`w-full px-3 py-2 rounded-lg border outline-none ${
                      isDark
                        ? "bg-slate-900 border-slate-700 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                    value={createForm.startTime}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, startTime: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">End Time</label>
                  <input
                    type="time"
                    className={`w-full px-3 py-2 rounded-lg border outline-none ${
                      isDark
                        ? "bg-slate-900 border-slate-700 text-slate-100"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                    value={createForm.endTime}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, endTime: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Venue</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDark
                      ? "bg-slate-900 border-slate-700 text-slate-100"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                  value={createForm.venue}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, venue: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-sm bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Add Event (Local Only)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
