import { STATIONS } from '../data/stations';
import { formatTime } from '../engine/etaEngine';
import type { Train } from '../types';

export default function ETATable({ train }: { train: Train }) {
  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-wide text-slate-500">
            <th className="py-3 px-4 font-medium">Station</th>
            <th className="py-3 px-4 font-medium">Scheduled</th>
            <th className="py-3 px-4 font-medium">Predicted</th>
            <th className="py-3 px-4 font-medium">Delay</th>
            <th className="py-3 px-4 font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {train.schedule.map((entry) => (
            <tr key={entry.stationCode} className="border-b border-white/[0.04] last:border-0 propagate-in">
              <td className="py-3 px-4">
                <div className="font-medium text-slate-200">{STATIONS[entry.stationCode].name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{entry.stationCode}</div>
              </td>
              <td className="py-3 px-4 text-slate-400 tabular">{formatTime(new Date(entry.scheduled))}</td>
              <td className="py-3 px-4 font-medium text-slate-100 tabular">{formatTime(new Date(entry.predicted))}</td>
              <td className={`py-3 px-4 tabular font-medium ${entry.delayMin > 15 ? 'text-crit' : entry.delayMin > 5 ? 'text-warn' : 'text-ok'}`}>
                {entry.delayMin > 0 ? `+${entry.delayMin}` : entry.delayMin}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs tabular text-slate-400 w-9">{entry.confidence}%</span>
                  <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-rail-red transition-all duration-500"
                      style={{ width: `${entry.confidence}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
