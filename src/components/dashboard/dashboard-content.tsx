import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CircleDot,
  Clock3,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { LiveCallsTable } from "@/components/dashboard/live-calls-table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import {
  customerDemo,
  dashboardMetrics,
  demoAgents,
  demoCalls,
  demoTickets,
  moodIcons,
  navigationItems,
  recentActivity,
} from "@/lib/mock/dashboard";

function maskPersonalId(id: string) {
  if (id.length <= 4) return id;
  return `${id.slice(0, 4)}••••${id.slice(-2)}`;
}

export function DashboardContent() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 lg:flex-row">
      <aside className="w-full border-b border-slate-800 bg-slate-950/90 p-5 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-50">AI CONTACT CENTER</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          SYSTEM ONLINE
        </div>

        <nav className="mt-8 space-y-1">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const active = label === "Dashboard";

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium ${
                  active
                    ? "bg-slate-800 text-slate-50 ring-1 ring-slate-700"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {active ? <ArrowRight className="h-4 w-4" /> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">AI CONTACT CENTER</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
              <CircleDot className="h-3.5 w-3.5 fill-current" />
              System Online
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500 hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-slate-50">AI Voice Contact Center</p>
            <p className="mt-1 text-sm text-slate-400">Prueba el AI Voice Contact Center</p>
          </div>

          <Link
            href="/live-calls"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            <PhoneCall className="mr-2 h-4 w-4" />
            SIMULAR LLAMADA
          </Link>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => {
            const Icon = moodIcons[metric.icon] ?? Sparkles;

            return (
              <KpiCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                icon={Icon}
              />
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)]">
          <div>
            <LiveCallsTable calls={demoCalls} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">Customer Demo</h2>
                <Badge tone="info">DEMO</Badge>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Customer</p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">{customerDemo.fullName}</p>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <p className="text-slate-400">Customer ID</p>
                    <p className="mt-1 text-slate-200">{customerDemo.customerId}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Personal ID</p>
                    <p className="mt-1 text-slate-200">{maskPersonalId(customerDemo.personalId)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p className="mt-1 text-slate-200">{customerDemo.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Request</p>
                    <p className="mt-1 text-slate-200">{customerDemo.requestId}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Request status</span>
                    <StatusBadge tone="info">{customerDemo.requestStatus}</StatusBadge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">Estimated resolution</span>
                    <span className="text-slate-200">{customerDemo.estimatedResolution}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="text-lg font-semibold text-slate-50">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                {recentActivity.map((event) => {
                  const eventReference =
                    event.metadata?.reference ??
                    event.metadata?.requestId ??
                    event.metadata?.customerId ??
                    event.metadata?.ticketId ??
                    event.metadata?.callerId ??
                    event.metadata?.target;

                  return (
                    <div key={`${event.timestamp}-${event.type}`} className="flex items-start gap-3">
                      <div className="mt-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400" />
                      <div className="flex-1 border-l border-slate-700 pl-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{event.timestamp}</p>
                        <p className="mt-1 text-sm text-slate-200">{event.type.replace(/_/g, " ")}</p>
                        {eventReference ? (
                          <p className="mt-1 text-xs text-slate-400">{String(eventReference)}</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Agents</h2>
              <Badge tone="neutral">LIVE</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {demoAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-100">{agent.name}</p>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{agent.shift}</p>
                    <div className="mt-1 flex justify-end">
                      <StatusBadge tone={agent.status === "ONLINE" ? "success" : agent.status === "BUSY" ? "warning" : "neutral"}>
                        {agent.status}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Tickets</h2>
              <Badge tone="info">OPEN</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {demoTickets.map((ticket) => (
                <div key={ticket.ticketId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-100">{ticket.ticketId}</p>
                    <Badge
                      tone={
                        ticket.priority === "HIGH"
                          ? "danger"
                          : ticket.priority === "MEDIUM"
                            ? "warning"
                            : "success"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{ticket.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{ticket.status}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-emerald-300" />
            <span>Last sync 10:43:05 UTC</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <span>Prepared for future AI + CRM integrations</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
