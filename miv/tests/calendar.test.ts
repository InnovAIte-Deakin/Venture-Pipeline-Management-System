import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { getCalendarAnalytics, getCalendarEvents } from "../app/dashboard/(operations)/calendar/api/calendar-api"
import { CalendarEventList } from "../app/dashboard/(operations)/calendar/components/calendar-event-list"
import { CalendarLoadingState } from "../app/dashboard/(operations)/calendar/components/calendar-loading-state"
import { dateKey, getMonthDays, groupEventsByDay, isToday, monthLabel, weekEnd } from "../app/dashboard/(operations)/calendar/lib/calendar-date-utils"
import { filterDeadlineEvents, filterMeetingEvents } from "../app/dashboard/(operations)/calendar/lib/calendar-event-filters"
import { eventTypes, eventViews, priorities, statuses, type CalendarEvent, type CalendarFilters } from "../app/dashboard/(operations)/calendar/types/calendar"

const event = (overrides: Partial<CalendarEvent> = {}): CalendarEvent => ({
  id: "1", title: "Team meeting", description: "Planning", type: "meeting",
  startDate: "2026-09-04", endDate: "2026-09-04", startTime: "09:00", endTime: "10:00",
  location: "Melbourne", attendees: [], organizer: "Team", status: "scheduled",
  priority: "medium", lastUpdate: "just now", ...overrides,
})
const filters: CalendarFilters = { search: "", type: "all", priority: "all", status: "all", view: "all" }
const response = (events: CalendarEvent[] = []) => ({ events, pagination: { page: 1, limit: 100, total: events.length, pages: events.length ? 1 : 0 } })

describe("Calendar dates", () => {
  for (const [year, month, days] of [[2024, 1, 29], [2025, 1, 28], [2026, 7, 31], [2026, 8, 30]]) {
    it(`builds 42 consecutive Sunday-first cells for ${year}-${month + 1}`, () => {
      const grid = getMonthDays(new Date(year, month, 15))
      assert.equal(grid.length, 42)
      assert.equal(grid[0].date.getDay(), 0)
      assert.equal(grid[41].date.getDay(), 6)
      assert.equal(grid.filter((day) => day.inMonth).length, days)
      for (let i = 1; i < grid.length; i++) {
        const next = new Date(grid[i - 1].date)
        next.setDate(next.getDate() + 1)
        assert.equal(dateKey(grid[i].date), dateKey(next))
      }
    })
  }
  it("includes adjacent years outside January", () => {
    const grid = getMonthDays(new Date(2026, 0, 1))
    assert.equal(dateKey(grid[0].date), "2025-12-28")
    assert.equal(grid[0].inMonth, false)
    assert.equal(dateKey(grid[41].date), "2026-02-07")
    assert.equal(grid[41].inMonth, false)
  })
  it("uses local fields for padded keys and labels, including invalid labels", () => {
    assert.equal(dateKey(new Date(2026, 0, 2, 0, 15)), "2026-01-02")
    assert.equal(monthLabel(new Date(2024, 1, 29)), "February 2024")
    assert.equal(monthLabel(new Date(NaN)), "")
  })
  it("ends a Sunday-first week on Saturday at the end of the day", () => {
    const end = weekEnd(new Date(2026, 8, 4))
    assert.equal(dateKey(end), "2026-09-05")
    assert.deepEqual([end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds()], [23, 59, 59, 999])
  })
  it("identifies today independently of time of day", () => {
    const now = new Date()
    const sameDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23)
    const previousDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23)
    assert.equal(isToday(sameDay), true)
    assert.equal(isToday(previousDay), false)
  })
  it("groups start dates in order without expanding multi-day events or mutating input", () => {
    const events = [event(), event({ id: "2" }), event({ id: "3", startDate: "2026-09-05", endDate: "2026-09-07" })]
    const before = structuredClone(events)
    const grouped = groupEventsByDay(events)
    assert.deepEqual(grouped.get("2026-09-04"), events.slice(0, 2))
    assert.deepEqual(grouped.get("2026-09-05"), [events[2]])
    assert.equal(grouped.has("2026-09-06"), false)
    assert.deepEqual(events, before)
  })
  it("ignores non-date-only keys and accepts empty input", () => {
    assert.equal(groupEventsByDay([event({ startDate: "invalid" }), event({ startDate: "2026-09-04T00:00:00Z" })]).size, 0)
    assert.equal(groupEventsByDay([]).size, 0)
  })
})

describe("Calendar category tabs", () => {
  const events = eventTypes.map((type, index) => event({ id: String(index), type }))
  it("includes meetings, calls, board meetings and due diligence only", () => {
    assert.deepEqual(filterMeetingEvents(events).map((item) => item.type), ["meeting", "call", "board_meeting", "due_diligence"])
  })
  it("includes only deadlines in the deadline tab", () => {
    assert.deepEqual(filterDeadlineEvents(events).map((item) => item.type), ["deadline"])
  })
  it("returns empty results for empty or nonmatching categories", () => {
    assert.deepEqual(filterMeetingEvents([]), [])
    assert.deepEqual(filterDeadlineEvents([]), [])
    assert.deepEqual(filterMeetingEvents([event({ type: "presentation" })]), [])
    assert.deepEqual(filterDeadlineEvents([event()]), [])
  })
  it("preserves API order, status and priority without mutation", () => {
    const input = [event({ id: "2", status: "cancelled", priority: "low" }), event({ id: "1", status: "completed", priority: "high" })]
    const before = structuredClone(input)
    assert.deepEqual(filterMeetingEvents(input), input)
    assert.deepEqual(input, before)
  })
})

describe("Calendar rendered states", () => {
  it("renders the loading message used while requests are pending", () => {
    const markup = renderToStaticMarkup(createElement(CalendarLoadingState))
    assert.match(markup, /Loading calendar\.\.\./)
  })
  it("renders the default and category-specific empty result messages", () => {
    assert.match(renderToStaticMarkup(createElement(CalendarEventList, { events: [] })), /No events found\./)
    assert.match(renderToStaticMarkup(createElement(CalendarEventList, { events: [], emptyMessage: "No meetings found." })), /No meetings found\./)
    assert.match(renderToStaticMarkup(createElement(CalendarEventList, { events: [], emptyMessage: "No deadlines found." })), /No deadlines found\./)
  })
  it("renders event content when results exist", () => {
    const markup = renderToStaticMarkup(createElement(CalendarEventList, { events: [event({ title: "Investment committee" })] }))
    assert.match(markup, /Investment committee/)
    assert.doesNotMatch(markup, /No events found\./)
  })
})

describe("Calendar API filters and states", () => {
  it("omits all filters and blank search while retaining the limit", async (t) => {
    const mock = t.mock.method(globalThis, "fetch", async () => Response.json(response()))
    await getCalendarEvents({ ...filters, search: "   " })
    assert.equal(String(mock.mock.calls[0].arguments[0]), "/api/calendar/events?limit=100")
  })
  it("combines filters and trims/encodes search safely", async (t) => {
    const mock = t.mock.method(globalThis, "fetch", async () => Response.json(response()))
    await getCalendarEvents({ search: "  Board & team + review  ", type: "board_meeting", priority: "high", status: "scheduled", view: "upcoming" })
    const url = new URL(String(mock.mock.calls[0].arguments[0]), "http://localhost")
    assert.deepEqual(Object.fromEntries(url.searchParams), { limit: "100", search: "Board & team + review", type: "board_meeting", priority: "high", status: "scheduled", view: "upcoming" })
  })
  for (const [key, values] of [["type", eventTypes], ["priority", priorities], ["status", statuses], ["view", eventViews]] as const) {
    it(`serializes every supported ${key} option`, async (t) => {
      const mock = t.mock.method(globalThis, "fetch", async () => Response.json(response()))
      for (const value of values) {
        await getCalendarEvents({ ...filters, [key]: value })
        const url = new URL(String(mock.mock.calls.at(-1)!.arguments[0]), "http://localhost")
        assert.equal(url.searchParams.get(key), value === "all" ? null : value)
      }
    })
  }
  it("returns populated and empty API results unchanged", async (t) => {
    let payload = response([event()])
    t.mock.method(globalThis, "fetch", async () => Response.json(payload))
    assert.deepEqual(await getCalendarEvents(filters), payload)
    payload = response()
    assert.deepEqual(await getCalendarEvents(filters), payload)
  })
  it("rejects missing, null and non-array event lists for the error/Retry state", async (t) => {
    let payload: unknown
    t.mock.method(globalThis, "fetch", async () => Response.json(payload))
    for (payload of [null, {}, { events: null }, { events: {} }, { events: "invalid" }]) {
      await assert.rejects(getCalendarEvents(filters), /Invalid calendar events response/)
    }
  })
  it("rejects HTTP failures and allows successful retry with the same filters", async (t) => {
    let calls = 0
    const mock = t.mock.method(globalThis, "fetch", async () => ++calls === 1 ? new Response("unavailable", { status: 503 }) : Response.json(response([event()])))
    await assert.rejects(getCalendarEvents(filters), /Failed to fetch events/)
    assert.equal((await getCalendarEvents(filters)).events.length, 1)
    assert.equal(mock.mock.calls[0].arguments[0], mock.mock.calls[1].arguments[0])
  })
  it("propagates network and invalid JSON failures", async (t) => {
    const mock = t.mock.method(globalThis, "fetch", async () => { throw new TypeError("Network unavailable") })
    await assert.rejects(getCalendarEvents(filters), /Network unavailable/)
    mock.mock.mockImplementation(async () => new Response("not json"))
    await assert.rejects(getCalendarEvents(filters), SyntaxError)
  })
  it("forwards cancellation signals and propagates AbortError", async (t) => {
    const controller = new AbortController()
    controller.abort()
    t.mock.method(globalThis, "fetch", async (_url: unknown, options?: RequestInit) => {
      assert.equal(options?.signal, controller.signal)
      throw new DOMException("Aborted", "AbortError")
    })
    await assert.rejects(getCalendarEvents(filters, controller.signal), { name: "AbortError" })
  })
  it("requests 30-day analytics with its signal", async (t) => {
    const controller = new AbortController()
    const mock = t.mock.method(globalThis, "fetch", async () => Response.json({ summary: { totalEvents: 0 } }))
    await getCalendarAnalytics(controller.signal)
    assert.deepEqual(mock.mock.calls[0].arguments, ["/api/calendar/analytics?period=30", { signal: controller.signal }])
  })
  it("reports analytics HTTP errors separately", async (t) => {
    t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 500 }))
    await assert.rejects(getCalendarAnalytics(), /Failed to fetch calendar analytics/)
  })
})
