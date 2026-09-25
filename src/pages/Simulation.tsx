import { Pause, Play, PlaySquare, Square } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { STATIONS } from '../data/stations';
import { formatTime } from '../engine/etaEngine';
import EventControl from '../components/EventControl';
import DelayPropagationView from '../components/DelayPropagationView';
import ETAChart from '../components/ETAChart';
import AIInsight from '../components/AIInsight';

export default function Simulation() {
  const {
    trains,
    selectedTrain,
    selectTrain,
    selectedTrainNumber,
    paused,
    togglePause,
    demoRunning,
    startDemo,
    stopDemo,
    lastEventImpact,
  } = useSimulation();

  if (!selectedTrain) return null;
  const nextStop = selectedTrain.schedule.find((e) => !e.arrived);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mb-1">Simulation Center</h2>
          <p className="text-sm text-slate-500">Simulate railway events and observe real-time ETA propagation.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/[0.08] bg-white/[0.02] text-sm text-slate-300 hover:bg-white/[0.05]"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? 'Resume' : 'Pause'}
          </button>
          {demoRunning ? (
            <button
              onClick={stopDemo}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-crit/90 hover:bg-crit text-sm text-white font-medium"
            >
              <Square size={14} />
              Stop Demo
            </button>
          ) : (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-rail-red hover:bg-rail-red/90 text-sm text-white font-medium"
            >
              <PlaySquare size={14} />
              Start Demo
            </button>
          )}
        </div>
      </div>

      <div className="panel p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Field label="Selected Train">
          <select
            value={selectedTrainNumber}
            onChange={(e) => selectTrain(e.target.value)}
            disabled={demoRunning}
            className="bg-navy-800 border border-white/[0.08] rounded-md px-2.5 py-1.5 text-sm text-slate-200 disabled:opacity-50"
          >
            {trains.map((t) => (
              <option key={t.trainNumber} value={t.trainNumber}>
                {t.trainNumber}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Current Location" value={STATIONS[selectedTrain.currentStationCode].name} />
        <Field label="Current ETA" value={nextStop ? formatTime(new Date(nextStop.predicted)) : '—'} />
        <Field label="Current Delay" value={`+${selectedTrain.currentDelayMin} min`} />
      </div>

      {lastEventImpact && (
        <div className="panel border border-rail-red/40 bg-rail-red/[0.08] px-5 py-3.5 propagate-in">
          <div className="text-xs font-semibold tracking-wide text-rail-red uppercase">{lastEventImpact.type.toUpperCase()} DETECTED</div>
          <div className="text-sm text-slate-300 mt-0.5">
            {lastEventImpact.section} · estimated impact{' '}
            <span className="font-semibold tabular text-slate-100">
              {lastEventImpact.impactMin > 0 ? `+${lastEventImpact.impactMin}` : lastEventImpact.impactMin} min
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <EventControl />
          <ETAChart train={selectedTrain} />
        </div>
        <div className="space-y-6">
          <DelayPropagationView train={selectedTrain} />
          <AIInsight train={selectedTrain} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-slate-500 mb-0.5">{label}</div>
      {children ?? <div className="text-sm font-medium text-slate-200 tabular">{value}</div>}
    </div>
  );
}
