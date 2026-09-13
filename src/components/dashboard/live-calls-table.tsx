import { StatusBadge } from "@/components/ui/badge";
import type { Call } from "@/types";

interface LiveCallsTableProps {
  calls: Call[];
}

const statusToneMap: Record<Call["status"], "success" | "warning" | "danger" | "info" | "neutral"> = {
  INCOMING: "info",
  IDENTIFICATION_REQUIRED: "warning",
  IDENTIFYING: "warning",
  VERIFIED: "success",
  NOT_VERIFIED: "danger",
  IN_CONVERSATION: "info",
  PROCESSING: "neutral",
  TRANSFER_PENDING: "warning",
  TRANSFERRED: "info",
  COMPLETED: "success",
  FAILED: "danger",
  ABANDONED: "danger",
};

const verificationToneMap: Record<Call["verificationStatus"], "success" | "warning" | "danger" | "info" | "neutral"> = {
  PENDING: "neutral",
  VERIFYING: "warning",
  VERIFIED: "success",
  ADDITIONAL_VERIFICATION: "info",
  FAILED: "danger",
  EXPIRED: "danger",
};

export function LiveCallsTable({ calls }: LiveCallsTableProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm shadow-slate-950/20">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">Live Calls</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 pr-4 font-medium">Call ID</th>
              <th className="pb-3 pr-4 font-medium">Caller ID</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Verification</th>
              <th className="pb-3 pr-4 font-medium">Duration</th>
              <th className="pb-3 font-medium">Intent</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.callId} className="border-b border-slate-800/80 text-slate-200 last:border-0">
                <td className="py-3 pr-4 font-medium text-slate-100">{call.callId}</td>
                <td className="py-3 pr-4 text-slate-300">{call.callerId}</td>
                <td className="py-3 pr-4 text-slate-300">{call.customerName}</td>
                <td className="py-3 pr-4">
                  <StatusBadge tone={statusToneMap[call.status]}>{call.status.replace(/_/g, " ")}</StatusBadge>
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge tone={verificationToneMap[call.verificationStatus]}>{call.verificationStatus.replace(/_/g, " ")}</StatusBadge>
                </td>
                <td className="py-3 pr-4 text-slate-300">{call.duration}</td>
                <td className="py-3 text-slate-300">{call.intent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
