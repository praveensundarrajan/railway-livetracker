import ETATable from '../components/ETATable';
import EtaFactorsChart from '../components/EtaFactorsChart';
import { useSimulation } from '../context/SimulationContext';
import { STATIONS } from '../data/stations';

export default function ETAForecast() {
  const { trains, selectedTrain, selectTrain, selectedTrainNumber } = useSimulation();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mb-1">ETA Forecast</h2>
          <p className="text-sm text-slate-500">Station-by-station predicted arrival times and confidence.</p>
        </div>
        <select
          value={selectedTrainNumber}
          onChange={(e) => selectTrain(e.target.value)}
          className="bg-navy-800 border border-white/[0.08] rounded-md px-3 py-2 text-sm text-slate-200"
        >
          {trains.map((t) => (
            <option key={t.trainNumber} value={t.trainNumber}>
              {t.trainNumber} — {STATIONS[t.originCode].name} → {STATIONS[t.destCode].name}
            </option>
          ))}
        </select>
      </div>

      {selectedTrain && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <ETATable train={selectedTrain} />
          <EtaFactorsChart train={selectedTrain} />
        </div>
      )}
    </div>
  );
}
