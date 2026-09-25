import { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { STATIONS } from '../data/stations';
import { ROUTES } from '../data/routes';
import { useSimulation } from '../context/SimulationContext';
import { interpolatePosition, formatTime } from '../engine/etaEngine';
import type { TrainStatus } from '../types';

const ROUTE = ROUTES['MAS-HYB'];
const ROUTE_LATLNGS: [number, number][] = ROUTE.stations.map((c) => [STATIONS[c].lat, STATIONS[c].lng]);

const STATUS_COLOR: Record<TrainStatus, string> = {
  'on-time': '#3fb27f',
  delayed: '#d99a3d',
  critical: '#d64545',
  recovering: '#4a9fd6',
};

function stationIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#0d1219;border:2px solid #c8442c;box-shadow:0 0 0 3px rgba(200,68,44,0.18);"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function trainIcon(color: string, bearing: number, isSelected: boolean, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-2px);">
        <div style="
          width:22px;height:22px;border-radius:7px;
          background:${color};
          border:2px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.35)'};
          box-shadow:0 0 0 4px ${color}33, 0 2px 6px rgba(0,0,0,0.5);
          display:flex;align-items:center;justify-content:center;
          transform:rotate(${bearing}deg);
        ">
          <div style="width:6px;height:6px;border-radius:50%;background:white;transform:rotate(${-bearing}deg);"></div>
        </div>
        <div style="
          margin-top:3px;padding:1px 6px;border-radius:4px;
          background:#0d1219ee;border:1px solid rgba(255,255,255,0.12);
          font-family:'IBM Plex Mono',monospace;font-size:10px;color:#d8dee7;white-space:nowrap;
        ">${label}</div>
      </div>`,
    iconSize: [22, 40],
    iconAnchor: [11, 14],
  });
}

function FitBoundsButton() {
  const map = useMap();
  const bounds = useMemo(() => L.latLngBounds(ROUTE_LATLNGS), []);
  return (
    <button
      onClick={() => map.fitBounds(bounds, { padding: [30, 30] })}
      className="absolute top-3 right-3 z-[1000] w-7 h-7 rounded-md bg-navy-850/90 border border-white/[0.1] hover:bg-navy-700 flex items-center justify-center text-slate-300"
      aria-label="Recenter map"
    >
      <LocateFixed size={14} />
    </button>
  );
}

export default function RailwayMap() {
  const { trains, selectTrain, selectedTrainNumber, selectedTrain } = useSimulation();
  const boundsRef = useRef(L.latLngBounds(ROUTE_LATLNGS));
  const routeTrains = trains.filter((t) => t.routeId === 'MAS-HYB');

  const nextEntry = selectedTrain?.schedule.find((e) => !e.arrived);
  const nextStationName = selectedTrain?.nextStationCode ? STATIONS[selectedTrain.nextStationCode].name : '—';
  const distToNext = selectedTrain?.nextStationCode
    ? Math.max(0, STATIONS[selectedTrain.nextStationCode].distanceKm - selectedTrain.distanceTravelledKm)
    : null;

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Live Network Map</h3>
        <span className="text-[11px] text-slate-500">Chennai ↔ Hyderabad corridor</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 min-w-0 rounded-lg overflow-hidden border border-white/[0.06] dark-tiles" style={{ height: 380 }}>
          <MapContainer
            bounds={boundsRef.current}
            boundsOptions={{ padding: [30, 30] }}
            scrollWheelZoom
            style={{ height: '100%', width: '100%', background: '#0a0e14' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              subdomains={['a', 'b', 'c']}
            />
            <Polyline
              positions={ROUTE_LATLNGS}
              pathOptions={{ color: '#c8442c', weight: 2.5, opacity: 0.6, dashArray: '1 6', lineCap: 'round' }}
            />
            {ROUTE.stations.map((code) => (
              <Marker key={code} position={[STATIONS[code].lat, STATIONS[code].lng]} icon={stationIcon()} />
            ))}
            {routeTrains.map((t) => {
              const pos = interpolatePosition(t.routeId, t.distanceTravelledKm);
              return (
                <Marker
                  key={t.trainNumber}
                  position={[pos.lat, pos.lng]}
                  icon={trainIcon(STATUS_COLOR[t.status], pos.bearing, t.trainNumber === selectedTrainNumber, t.trainNumber)}
                  eventHandlers={{ click: () => selectTrain(t.trainNumber) }}
                />
              );
            })}
            <FitBoundsButton />
          </MapContainer>
        </div>

        {selectedTrain && (
          <div className="lg:w-56 shrink-0 flex flex-col gap-2.5">
            <StatBox label="Distance to Next Station" value={distToNext !== null ? `${Math.round(distToNext)} km` : '—'} sub={nextStationName} />
            <StatBox label="Current Speed" value={`${selectedTrain.speedKmh} km/h`} />
            <StatBox
              label="Estimated Arrival"
              value={nextEntry ? formatTime(new Date(nextEntry.predicted)) : '—'}
              sub={nextStationName}
            />
            <StatBox
              label="Expected Delay"
              value={`+${selectedTrain.currentDelayMin} min`}
              tone={selectedTrain.currentDelayMin > 15 ? 'crit' : selectedTrain.currentDelayMin > 5 ? 'warn' : 'ok'}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-slate-500">
        <LegendDot color={STATUS_COLOR['on-time']} label="On Time" />
        <LegendDot color={STATUS_COLOR.delayed} label="Delayed" />
        <LegendDot color={STATUS_COLOR.critical} label="Critical" />
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-rail-red" /> Station
        </span>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'ok' | 'warn' | 'crit' }) {
  const toneClass = tone === 'crit' ? 'text-crit' : tone === 'warn' ? 'text-warn' : tone === 'ok' ? 'text-ok' : 'text-slate-100';
  return (
    <div className="bg-navy-800/80 border border-white/[0.06] rounded-lg px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className={`text-lg font-semibold tabular ${toneClass}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</div>}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
