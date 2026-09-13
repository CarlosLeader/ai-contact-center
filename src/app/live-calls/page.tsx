import Link from "next/link";
import {
  ArrowLeft,
  AudioLines,
  CircleDot,
  Clock3,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import { Badge, StatusBadge } from "@/components/ui/badge";
import { customerDemo, demoCalls, demoAgents, recentActivity } from "@/lib/mock/dashboard";

const activeCall = demoCalls[0];

export default function LiveCallsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                AI CONTACT CENTER
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">
                Live Calls
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
              <CircleDot className="h-3.5 w-3.5 fill-current" />
              System Online
            </div>
            <Badge tone="info">SIMULATOR</Badge>
          </div>
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.85fr)]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current simulated call</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-50">{activeCall.callId}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="success">{activeCall.status.replace(/_/g, " ")}</StatusBadge>
                  <StatusBadge tone="success">{activeCall.verificationStatus.replace(/_/g, " ")}</StatusBadge>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Caller ID</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{activeCall.callerId}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{activeCall.customerName}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Request</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{activeCall.requestId}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Duration</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{activeCall.duration}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-50">Interaction Flow</h3>
                  <AudioLines className="h-5 w-5 text-emerald-300" />
                </div>

                <div className="mt-4 space-y-4">
                  {[
                    { title: "Caller ID captured", meta: "10:42:21", tone: "success" },
                    { title: "Personal ID requested", meta: "10:42:34", tone: "warning" },
                    { title: "Customer verified", meta: "10:42:41", tone: "success" },
                    { title: "CRM request lookup", meta: "10:43:02", tone: "info" },
                    { title: "AI response generated", meta: "10:43:05", tone: "success" },
                  ].map((step) => (
                    <div key={step.title} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-100">{step.title}</p>
                          <StatusBadge tone={step.tone as "success" | "warning" | "info"}>{step.meta}</StatusBadge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-50">Verification</h3>
                  <UserRoundCheck className="h-5 w-5 text-sky-300" />
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
                    <div className="mt-2">
                      <StatusBadge tone="success">VERIFIED</StatusBadge>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Personal ID</p>
                    <p className="mt-2 font-mono text-sm text-slate-200">{customerDemo.personalId.slice(0, 4)}••••{customerDemo.personalId.slice(-2)}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CRM</p>
                    <p className="mt-2 text-sm text-slate-200">{customerDemo.customerId} • {customerDemo.requestId}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Call Controls</h3>
                <PhoneCall className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Resume Call
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500"
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-sky-300" />
                  Verify Customer
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500"
                >
                  <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                  Trigger AI Action
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Recent Activity</h3>
                <Clock3 className="h-5 w-5 text-slate-300" />
              </div>

              <div className="mt-4 space-y-4">
                {recentActivity.slice(0, 5).map((event) => (
                  <div key={`${event.timestamp}-${event.event}`} className="flex items-start gap-3 border-l border-slate-700 pl-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{event.timestamp}</p>
                      <p className="mt-1 text-sm text-slate-200">{event.event}</p>
                      {event.reference ? (
                        <p className="mt-1 text-xs text-slate-400">{event.reference}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Agents</h3>
              </div>

              <div className="mt-4 space-y-3">
                {demoAgents.map((agent) => (
                  <div key={agent.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.role}</p>
                      </div>
                      <StatusBadge tone={agent.status === "ONLINE" ? "success" : agent.status === "BUSY" ? "warning" : "neutral"}>
                        {agent.status}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
