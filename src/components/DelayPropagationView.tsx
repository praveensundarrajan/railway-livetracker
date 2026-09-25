import { ChevronDown } from 'lucide-react';
import { STATIONS } from '../data/stations';
import type { Train } from '../types';

export default function DelayPropagationView({ train }: { train: Train }) {
  const upcoming = train.schedule.filter((e) => !e.arrived).slice(0, 5);

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Delay Propagation</h3>
        <span className="text-[11px] text-slate-500">{train.lastUpdatedLabel}</span>
      </div>

      <div className="flex flex-col items-center">
        {upcoming.map((entry, i) => (
          <div key={entry.stationCode} className="flex flex-col items-center propagate-in">
            <div className="panel !bg-navy-800 px-4 py-2 text-center min-w-[150px]">
              <div className="text-sm font-medium text-slate-200">{STATIONS[entry.stationCode].name}</div>
              <div
                className={`text-xs font-semibold tabular ${
                  entry.delayMin > 15 ? 'text-crit' : entry.delayMin > 5 ? 'text-warn' : 'text-ok'
                }`}
              >
                {entry.delayMin > 0 ? `+${entry.delayMin} min` : 'On time'}
              </div>
            </div>
            {i < upcoming.length - 1 && <ChevronDown size={16} className="text-slate-600 my-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}
