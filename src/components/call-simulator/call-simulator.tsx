"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AudioLines,
  Clock3,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import { Badge, StatusBadge } from "@/components/ui/badge";
import {
  appendDtmfInput,
  connectCall,
  createDemoCall,
  executeDemoIntent,
  maskPersonalId,
  requestIdentification,
  resolveCall,
  submitPersonalId,
} from "@/lib/call-simulator";
import { customerDemo, demoAgents, recentActivity } from "@/lib/mock/dashboard";
import type { CallSimulationState, CallStatus, VerificationStatus } from "@/types";

const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

const actionLabels = [
  "Consultar solicitud",
  "Crear ticket",
  "Hablar con un agente",
  "Finalizar llamada",
] as const;

function toneForStatus(status: CallStatus): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "CALLING":
    case "CONNECTED":
    case "AI_LISTENING":
    case "AI_SPEAKING":
    case "CRM_ACTION":
      return "info";
    case "IDENTIFICATION_REQUIRED":
    case "IDENTIFYING":
    case "TRANSFER_PENDING":
      return "warning";
    case "VERIFIED":
    case "RESOLVED":
    case "CALL_ENDED":
    case "TRANSFERRED":
      return "success";
    case "FAILED":
    case "ABANDONED":
      return "danger";
    default:
      return "neutral";
  }
}

function toneForVerification(
  verificationStatus: VerificationStatus,
): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (verificationStatus) {
    case "VERIFIED":
      return "success";
    case "VERIFYING":
    case "PENDING":
      return "warning";
    case "ADDITIONAL_VERIFICATION":
      return "info";
    case "FAILED":
    case "EXPIRED":
      return "danger";
    default:
      return "neutral";
  }
}

export function CallSimulator() {
  const [call, setCall] = useState<CallSimulationState | null>(() => createDemoCall());
  const [history, setHistory] = useState<CallSimulationState[]>([]);

  useEffect(() => {
    if (!call) {
      return;
    }

    if (call.status === "CALLING") {
      const timer = window.setTimeout(() => {
        setCall((current) => (current ? connectCall(current) : null));
      }, 700);

      return () => window.clearTimeout(timer);
    }

    if (call.status === "CONNECTED") {
      const timer = window.setTimeout(() => {
        setCall((current) => (current ? requestIdentification(current) : null));
      }, 900);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [call]);

  const maskedPersonalId = useMemo(() => {
    return call ? maskPersonalId(call.personalIdInput || customerDemo.personalId) : "";
  }, [call]);

  const handleKeyPress = (value: string) => {
    if (!call) {
      return;
    }

    if (value === "✓") {
      setCall((current) => (current ? submitPersonalId(current) : null));
      return;
    }

    if (value === "⌫") {
      setCall((current) => (current ? { ...current, personalIdInput: current.personalIdInput.slice(0, -1) } : null));
      return;
    }

    setCall((current) => (current ? appendDtmfInput(current, value) : null));
  };

  const handleAction = (action: (typeof actionLabels)[number]) => {
    if (!call || call.verificationStatus !== "VERIFIED") {
      return;
    }

    setCall((current) => {
      if (!current) {
        return null;
      }

      const nextCall =
        action === "Finalizar llamada"
          ? resolveCall(current)
          : executeDemoIntent(current, action);

      if (nextCall.summary) {
        setHistory((previous) => {
          if (previous.some((item) => item.callId === nextCall.callId)) {
            return previous;
          }

          return [nextCall, ...previous];
        });
      }

      return nextCall;
    });
  };

  if (!call) {
    return null;
  }

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
                LIVE CALL
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
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
                  <p className="text-sm text-slate-400">Call ID</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-50">{call.callId}</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={toneForStatus(call.status)}>
                    {call.status.replace(/_/g, " ")}
                  </StatusBadge>
                  <StatusBadge tone={toneForVerification(call.verificationStatus)}>
                    {call.verificationStatus.replace(/_/g, " ")}
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Caller ID</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{call.callerId}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</p>
                  <p className="mt-2 text-base font-medium text-slate-50">
                    {call.verificationStatus === "VERIFIED" ? call.customerName : "Unverified"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Duration</p>
                  <p className="mt-2 text-base font-medium text-slate-50">{call.duration}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attempt</p>
                  <p className="mt-2 text-base font-medium text-slate-50">
                    {call.attempts} of {call.maxAttempts}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-50">Conversation</h3>
                  <AudioLines className="h-5 w-5 text-emerald-300" />
                </div>

                <div className="mt-4 space-y-3">
                  {call.conversation.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-xl border p-3 ${
                        message.speaker === "AI"
                          ? "border-sky-500/30 bg-sky-500/10"
                          : "border-slate-700 bg-slate-950/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                          {message.speaker}
                        </p>
                        <span className="text-[10px] text-slate-500">{message.timestamp}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-100">{message.text}</p>
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
                      <StatusBadge tone={toneForVerification(call.verificationStatus)}>
                        {call.verificationStatus}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Personal ID</p>
                    <p className="mt-2 font-mono text-sm text-slate-200">
                      {call.verificationStatus === "VERIFIED"
                        ? customerDemo.personalId
                        : maskedPersonalId || "••••••••••••"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CRM</p>
                    <p className="mt-2 text-sm text-slate-200">
                      {call.verificationStatus === "VERIFIED"
                        ? `${call.customerId} • ${call.requestId}`
                        : "No available until identity is verified."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">DTMF Keypad</h3>
                <PhoneCall className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {keypadRows.flat().map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeyPress(key)}
                    className="flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-lg font-semibold text-slate-100 hover:border-slate-500"
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleKeyPress("⌫")}
                  className="flex flex-1 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-500"
                >
                  ⌫ borrar
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress("✓")}
                  className="flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  ✓ enviar
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Call actions</h3>
                <ShieldCheck className="h-5 w-5 text-sky-300" />
              </div>

              <div className="mt-4 space-y-3">
                {actionLabels.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => handleAction(action)}
                    disabled={call.verificationStatus !== "VERIFIED"}
                    className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${
                      call.verificationStatus === "VERIFIED"
                        ? "bg-slate-800 text-slate-100 hover:border-slate-500"
                        : "cursor-not-allowed bg-slate-800/60 text-slate-500"
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Call event timeline</h3>
              <div className="mt-4 space-y-4">
                {call.events
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <div key={`${event.timestamp}-${index}`} className="border-l border-slate-700 pl-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                        {event.timestamp}
                      </p>
                      <p className="mt-1 text-sm text-slate-200">{event.event}</p>
                      {event.reference ? (
                        <p className="mt-1 text-xs text-slate-400">{event.reference}</p>
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h3 className="text-lg font-semibold text-slate-50">Recent activity</h3>
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
                <h3 className="text-lg font-semibold text-slate-50">Demo agents</h3>
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

        {call.summary ? (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-300" />
                <h3 className="text-xl font-semibold text-slate-50">Call Summary</h3>
              </div>
              <Badge tone={call.summary.transferred ? "info" : "success"}>
                {call.summary.transferred ? "Transferred" : "Resolved"}
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</p>
                <p className="mt-2 text-sm text-slate-100">{call.summary.customerName}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Intent</p>
                <p className="mt-2 text-sm text-slate-100">{call.summary.intent}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Duration</p>
                <p className="mt-2 text-sm text-slate-100">{call.summary.duration}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Verification</p>
                <p className="mt-2 text-sm text-slate-100">{call.summary.verificationStatus}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Resolution</p>
              <p className="mt-2 text-sm text-slate-200">{call.summary.resolution}</p>
            </div>
          </section>
        ) : null}

        {history.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-50">Call History</h3>
              <Clock3 className="h-5 w-5 text-slate-300" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {history.map((item) => (
                <div key={item.callId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-sm font-semibold text-slate-100">{item.callId}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.callerId}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.customerName}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
