import { Sparkles } from 'lucide-react';
import type { Train } from '../types';
import { buildAiInsight } from '../engine/delayPropagation';

export default function AIInsight({ train }: { train: Train }) {
  return (
    <div className="panel p-5 border-rail-red/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-rail-red" />
        <h3 className="text-sm font-semibold text-slate-200">ETA Prediction Engine</h3>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{buildAiInsight(train)}</p>
      <p className="text-[11px] text-slate-600 mt-3">Prototype uses simulated railway telemetry, not a live-trained model.</p>
    </div>
  );
}
