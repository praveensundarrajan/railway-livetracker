import { ArrowDown } from 'lucide-react';

const STAGES = [
  { label: 'Live Train Data', sub: 'GPS / Telemetry, operational events' },
  { label: 'Data Ingestion', sub: 'Normalizes incoming telemetry streams' },
  { label: 'Feature Engineering', sub: 'Speed, dwell, congestion, section history' },
  { label: 'ETA Prediction Engine', sub: 'Computes station-by-station forecasts' },
  { label: 'Delay Propagation Engine', sub: 'Cascades impact to downstream stations' },
  { label: 'Real-Time API', sub: 'Serves live predictions to clients' },
  { label: 'Control Dashboard', sub: 'Operations center visualization' },
  { label: 'Passenger Information', sub: 'Simplified rider-facing ETAs' },
];

const INPUTS = [
  { label: 'GPS / Telemetry', future: false },
  { label: 'Historical Data', future: false },
  { label: 'Operational Events', future: false },
  { label: 'Weather Data', future: true },
  { label: 'Network Conditions', future: true },
];

export default function SystemArchitecture() {
  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <h2 className="text-xl font-semibold text-slate-100 mb-1">System Architecture</h2>
      <p className="text-sm text-slate-500 mb-8">How data flows from telemetry to prediction to the passenger.</p>

      <div className="flex flex-col items-center">
        {STAGES.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center w-full">
            <div className="panel w-full max-w-md px-5 py-3.5 text-center">
              <div className="text-sm font-semibold text-slate-100">{s.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.sub}</div>
            </div>
            {i < STAGES.length - 1 && <ArrowDown size={18} className="text-slate-600 my-1.5" />}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-3">Input Sources</div>
        <div className="flex flex-wrap gap-2">
          {INPUTS.map((inp) => (
            <span
              key={inp.label}
              className={`px-3 py-1.5 rounded-md text-xs border ${
                inp.future
                  ? 'border-white/[0.08] text-slate-500 bg-white/[0.02]'
                  : 'border-rail-red/30 text-slate-200 bg-rail-red/[0.06]'
              }`}
            >
              {inp.label}
              {inp.future && <span className="text-slate-600"> *Future integration</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
