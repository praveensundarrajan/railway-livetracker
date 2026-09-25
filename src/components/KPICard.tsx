import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'default' | 'ok' | 'warn' | 'crit';
  sub?: string;
}

const TONE_MAP: Record<string, string> = {
  default: 'text-slate-200',
  ok: 'text-ok',
  warn: 'text-warn',
  crit: 'text-crit',
};

export default function KPICard({ label, value, icon: Icon, tone = 'default', sub }: KPICardProps) {
  return (
    <div className="panel px-5 py-4 flex items-start justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">{label}</div>
        <div className={`text-2xl font-semibold tabular ${TONE_MAP[tone]}`}>{value}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
      </div>
      <div className="w-9 h-9 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0">
        <Icon size={17} className="text-slate-400" />
      </div>
    </div>
  );
}
