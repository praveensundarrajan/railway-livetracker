import { TrainFront, CheckCircle2, AlertTriangle, Target } from 'lucide-react';
import KPICard from '../components/KPICard';
import RailwayMap from '../components/RailwayMap';
import TrainDetails from '../components/TrainDetails';
import AIInsight from '../components/AIInsight';
import AlertPanel from '../components/AlertPanel';
import { useSimulation } from '../context/SimulationContext';

export default function Dashboard() {
  const { trains, alerts, selectedTrain } = useSimulation();
  const onTime = trains.filter((t) => t.status === 'on-time').length;
  const delayed = trains.filter((t) => t.status === 'delayed' || t.status === 'critical').length;
  const avgError = (trains.reduce((s, t) => s + (100 - t.confidence) / 8, 0) / trains.length).toFixed(1);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Good Evening, Control Room</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time railway network intelligence and ETA forecasting.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Active Trains" value={String(trains.length)} icon={TrainFront} />
        <KPICard label="On Time" value={String(onTime)} icon={CheckCircle2} tone="ok" />
        <KPICard label="Delayed" value={String(delayed)} icon={AlertTriangle} tone="warn" />
        <KPICard label="Avg ETA Error" value={`${avgError} min`} icon={Target} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <RailwayMap />
        {selectedTrain && <TrainDetails />}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {selectedTrain && <AIInsight train={selectedTrain} />}
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500 mb-3">Recent Alerts</div>
          <AlertPanel alerts={alerts} compact />
        </div>
      </div>

      <footer className="pt-4 pb-2 text-center text-[11px] text-slate-600 border-t border-white/[0.05]">
        RailPredict AI — Dynamic ETA Forecasting Prototype · SIH 2026 — SIH26028
        <br />
        Prototype uses simulated railway telemetry and operational data for demonstration.
      </footer>
    </div>
  );
}
