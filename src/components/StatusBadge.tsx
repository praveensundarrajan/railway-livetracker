import type { TrainStatus } from '../types';

const CONFIG: Record<TrainStatus, { label: string; className: string }> = {
  'on-time': { label: 'ON TIME', className: 'bg-ok/10 text-ok border-ok/30' },
  delayed: { label: 'DELAYED', className: 'bg-warn/10 text-warn border-warn/30' },
  critical: { label: 'CRITICAL', className: 'bg-crit/10 text-crit border-crit/30' },
  recovering: { label: 'RECOVERING', className: 'bg-sky-400/10 text-sky-400 border-sky-400/30' },
};

export default function StatusBadge({ status, delayMin }: { status: TrainStatus; delayMin?: number }) {
  const c = CONFIG[status];
  const suffix = typeof delayMin === 'number' && status !== 'on-time' ? ` +${delayMin} MIN` : '';
  return (
    <span className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold tracking-wide tabular ${c.className}`}>
      {c.label}
      {suffix}
    </span>
  );
}
