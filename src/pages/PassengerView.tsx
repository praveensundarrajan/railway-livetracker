import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrainTrack, ArrowLeft } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { STATIONS } from '../data/stations';
import { formatTime } from '../engine/etaEngine';
import StatusBadge from '../components/StatusBadge';

export default function PassengerView() {
  const { trains } = useSimulation();
  const [query, setQuery] = useState('12603');
  const train = trains.find((t) => t.trainNumber === query.trim());
  const upcoming = train?.schedule.filter((e) => !e.arrived).slice(0, 4) ?? [];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 flex justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-6">
          <ArrowLeft size={13} /> Control Room
        </Link>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-md bg-rail-red/90 flex items-center justify-center">
            <TrainTrack size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">RailPredict AI</div>
            <div className="text-[11px] text-slate-500">Passenger Information</div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter train number, e.g. 12603"
            className="w-full bg-navy-850 border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rail-red/50"
          />
        </div>

        {!train && (
          <div className="panel p-6 text-center text-sm text-slate-500">Train not found. Try 12603, 12608, 12786, 12639 or 17209.</div>
        )}

        {train && (
          <div className="space-y-5">
            <div className="panel p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-semibold text-slate-100 tabular">{train.trainNumber}</div>
                  <div className="text-xs text-slate-500">
                    {STATIONS[train.originCode].name} → {STATIONS[train.destCode].name}
                  </div>
                </div>
                <StatusBadge status={train.status} delayMin={train.currentDelayMin} />
              </div>
              <div className="text-xs text-slate-500 mb-1">Current location</div>
              <div className="text-sm font-medium text-slate-200 mb-4">{STATIONS[train.currentStationCode].name}</div>

              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-rail-red transition-all duration-700" style={{ width: `${train.progressPct}%` }} />
              </div>
              <div className="text-[11px] text-slate-500 mt-2">{train.lastUpdatedLabel}, adjusted for live conditions.</div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-3">Next Stations</div>
              <div className="space-y-2">
                {upcoming.map((e) => (
                  <div key={e.stationCode} className="panel px-4 py-3 flex items-center justify-between propagate-in">
                    <span className="text-sm text-slate-200">{STATIONS[e.stationCode].name}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium tabular text-slate-100">{formatTime(new Date(e.predicted))}</div>
                      {e.delayMin > 0 && <div className="text-[11px] text-warn tabular">+{e.delayMin} min</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
