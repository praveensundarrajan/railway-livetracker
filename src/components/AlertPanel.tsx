import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import type { AlertItem } from '../types';

const SEVERITY_CONFIG = {
  critical: { icon: AlertOctagon, className: 'border-crit/30 bg-crit/[0.06] text-crit', label: 'CRITICAL' },
  warning: { icon: AlertTriangle, className: 'border-warn/30 bg-warn/[0.06] text-warn', label: 'WARNING' },
  info: { icon: Info, className: 'border-sky-400/30 bg-sky-400/[0.06] text-sky-400', label: 'INFO' },
} as const;

export default function AlertPanel({ alerts, compact = false }: { alerts: AlertItem[]; compact?: boolean }) {
  if (alerts.length === 0) {
    return (
      <div className="panel p-6 text-center text-sm text-slate-500">
        No active alerts. Trigger a simulation event to see live alerts appear here.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {alerts.slice(0, compact ? 4 : undefined).map((a) => {
        const cfg = SEVERITY_CONFIG[a.severity];
        const Icon = cfg.icon;
        return (
          <div key={a.id} className={`panel border px-4 py-3 flex items-start gap-3 propagate-in ${cfg.className}`}>
            <Icon size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-wide">{cfg.label}</span>
                <span className="text-xs text-slate-400 font-mono">{a.trainNumber}</span>
              </div>
              <div className="text-sm text-slate-200 mt-0.5">{a.message}</div>
              <div className="text-xs text-slate-500 mt-0.5">{a.location}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold tabular">
                {a.impactMin > 0 ? `+${a.impactMin}` : a.impactMin} min
              </div>
              <div className="text-[11px] text-slate-500 tabular">{a.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
