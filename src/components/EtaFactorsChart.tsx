import type { Train } from '../types';
import { totalFactorMinutes } from '../engine/etaEngine';

export default function EtaFactorsChart({ train }: { train: Train }) {
  const maxAbs = Math.max(5, ...train.factors.map((f) => Math.abs(f.minutes)));
  const total = totalFactorMinutes(train.factors);

  return (
    <div className="panel p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">ETA Prediction Factors</h3>
      <p className="text-xs text-slate-500 mb-5">What's contributing to the current forecast</p>

      <div className="space-y-3">
        {train.factors.map((f, i) => {
          const isNeg = f.minutes < 0;
          const widthPct = (Math.abs(f.minutes) / maxAbs) * 100;
          return (
            <div key={i} className="flex items-center gap-3 propagate-in">
              <div className="w-40 text-xs text-slate-400 shrink-0 truncate">{f.label}</div>
              <div className="flex-1 h-5 rounded bg-white/[0.04] relative overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${isNeg ? 'bg-ok/70' : 'bg-rail-red/80'}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className={`w-14 text-right text-xs font-medium tabular ${isNeg ? 'text-ok' : 'text-slate-300'}`}>
                {f.minutes > 0 ? `+${f.minutes}` : f.minutes} min
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
        <span className="text-xs text-slate-500">Total predicted impact</span>
        <span className="text-base font-semibold text-slate-100 tabular">
          {total > 0 ? `+${total}` : total} min
        </span>
      </div>
    </div>
  );
}
