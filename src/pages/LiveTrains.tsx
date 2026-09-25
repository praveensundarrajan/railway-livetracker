import { STATIONS } from '../data/stations';
import StatusBadge from '../components/StatusBadge';
import TrainDetails from '../components/TrainDetails';
import { useSimulation } from '../context/SimulationContext';

export default function LiveTrains() {
  const { trains, selectTrain, selectedTrainNumber } = useSimulation();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-xl font-semibold text-slate-100 mb-1">Live Trains</h2>
      <p className="text-sm text-slate-500 mb-6">Fleet status across the network — select a train for full telemetry.</p>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-3 px-4 font-medium">Train</th>
                <th className="py-3 px-4 font-medium">Route</th>
                <th className="py-3 px-4 font-medium">Current Location</th>
                <th className="py-3 px-4 font-medium">Speed</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((t) => (
                <tr
                  key={t.trainNumber}
                  onClick={() => selectTrain(t.trainNumber)}
                  className={`border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors ${
                    t.trainNumber === selectedTrainNumber ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-200">{t.trainNumber}</td>
                  <td className="py-3 px-4 text-slate-400">
                    {STATIONS[t.originCode].name} → {STATIONS[t.destCode].name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{STATIONS[t.currentStationCode].name}</td>
                  <td className="py-3 px-4 tabular text-slate-300">{t.speedKmh} km/h</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={t.status} delayMin={t.currentDelayMin} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TrainDetails />
      </div>
    </div>
  );
}
