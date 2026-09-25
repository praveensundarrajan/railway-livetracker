import { Radio } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function Header() {
  const { clockLabel, paused } = useSimulation();

  return (
    <header className="h-16 shrink-0 border-b border-white/[0.06] bg-navy-900/70 backdrop-blur flex items-center justify-between px-6">
      <div>
        <h1 className="text-[15px] font-semibold text-slate-100">Railway Operations Center</h1>
        <p className="text-xs text-slate-500">Live simulation environment</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={`status-dot ${paused ? 'bg-slate-500' : 'bg-rail-red pulse-live'}`} />
          <span className={paused ? 'text-slate-500' : 'text-rail-red'}>{paused ? 'PAUSED' : 'LIVE'}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-sm text-slate-200 tabular">
          <Radio size={14} className="text-slate-500" />
          {clockLabel}
        </div>

        <div className="flex items-center gap-2 pl-6 border-l border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-navy-600 flex items-center justify-center text-[11px] font-semibold text-slate-300">
            CR
          </div>
          <span className="text-xs text-slate-400">Control Room</span>
        </div>
      </div>
    </header>
  );
}
