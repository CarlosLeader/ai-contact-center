import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function KpiCard({ title, value, icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm shadow-slate-950/20">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-tight text-slate-50">{value}</div>
    </div>
  );
}
