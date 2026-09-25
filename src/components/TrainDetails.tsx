import { STATIONS } from '../data/stations';
import { useSimulation } from '../context/SimulationContext';
import StatusBadge from './StatusBadge';

export default function TrainDetails() {
  const { selectedTrain } = useSimulation();
  if (!selectedTrain) return null;
  const t = selectedTrain;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-lg font-semibold text-slate-100 tabular">{t.trainNumber}</div>
          <div className="text-xs text-slate-500">
            {STATIONS[t.originCode].name} → {STATIONS[t.destCode].name}
          </div>
        </div>
        <StatusBadge status={t.status} delayMin={t.currentDelayMin} />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-5">
        <Field label="Location" value={STATIONS[t.currentStationCode].name} />
        <Field label="Speed" value={`${t.speedKmh} km/h`} />
        <Field label="Direction" value={t.direction} />
        <Field label="Progress" value={`${t.progressPct}%`} />
      </div>

      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-6">
        <div
          className="h-full bg-rail-red transition-all duration-700"
          style={{ width: `${t.progressPct}%` }}
        />
      </div>

      <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-3">Current Telemetry</div>
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
        <Field label="Distance travelled" value={`${t.distanceTravelledKm} km`} />
        <Field label="Distance remaining" value={`${t.distanceRemainingKm} km`} />
        <Field label="Current delay" value={`+${t.currentDelayMin} min`} tone={t.currentDelayMin > 15 ? 'crit' : t.currentDelayMin > 5 ? 'warn' : 'ok'} />
        <Field label="Last signal" value={t.lastSignal} />
        <Field label="Next station" value={t.nextStationCode ? STATIONS[t.nextStationCode].name : '—'} />
        <Field label="Confidence" value={`${t.confidence}%`} />
      </div>
    </div>
  );
}

function Field({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'warn' | 'crit' }) {
  const toneClass = tone === 'crit' ? 'text-crit' : tone === 'warn' ? 'text-warn' : tone === 'ok' ? 'text-ok' : 'text-slate-200';
  return (
    <div>
      <div className="text-[11px] text-slate-500 mb-0.5">{label}</div>
      <div className={`font-medium tabular ${toneClass}`}>{value}</div>
    </div>
  );
}
