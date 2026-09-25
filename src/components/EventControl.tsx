import { Signpost, TrainFront, Gauge, Timer, Zap, RotateCcw } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const EVENTS: Array<{ type: 'signal-delay' | 'congestion' | 'speed-restriction' | 'extended-halt' | 'increased-speed'; label: string; icon: typeof Signpost; tone: string }> = [
  { type: 'signal-delay', label: 'Signal Delay', icon: Signpost, tone: 'hover:border-warn/50 hover:bg-warn/[0.06]' },
  { type: 'congestion', label: 'Track Congestion', icon: TrainFront, tone: 'hover:border-crit/50 hover:bg-crit/[0.06]' },
  { type: 'speed-restriction', label: 'Temporary Speed Restriction', icon: Gauge, tone: 'hover:border-warn/50 hover:bg-warn/[0.06]' },
  { type: 'extended-halt', label: 'Extended Station Halt', icon: Timer, tone: 'hover:border-warn/50 hover:bg-warn/[0.06]' },
  { type: 'increased-speed', label: 'Increased Train Speed', icon: Zap, tone: 'hover:border-ok/50 hover:bg-ok/[0.06]' },
];

export default function EventControl() {
  const { triggerEvent, resetSimulation, demoRunning } = useSimulation();

  return (
    <div className="panel p-5">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-4">Operational Events</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {EVENTS.map(({ type, label, icon: Icon, tone }) => (
          <button
            key={type}
            disabled={demoRunning}
            onClick={() => triggerEvent(type)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-md border border-white/[0.07] bg-white/[0.02] text-sm text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${tone}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
        <button
          disabled={demoRunning}
          onClick={resetSimulation}
          className="flex items-center gap-2.5 px-4 py-3 rounded-md border border-white/[0.07] bg-white/[0.02] text-sm text-slate-400 hover:border-white/20 hover:bg-white/[0.05] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
          Reset Simulation
        </button>
      </div>
    </div>
  );
}
