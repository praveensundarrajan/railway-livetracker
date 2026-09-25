import type { EtaFactor, ScheduleEntry, Train } from '../types';
import { ROUTES } from '../data/routes';
import { STATIONS } from '../data/stations';

// Simulated "now" — fixed reference clock the whole app treats as live.
export const SIM_START = (() => {
  const d = new Date();
  d.setHours(21, 32, 45, 0);
  return d;
})();

export function parseTimeToday(hhmm: string, rolloverAfter?: Date): Date {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(SIM_START);
  d.setHours(h, m, 0, 0);
  if (rolloverAfter && d.getTime() < rolloverAfter.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function addMinutes(d: Date, min: number): Date {
  return new Date(d.getTime() + min * 60000);
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export interface RawStop {
  stationCode: string;
  scheduled: string; // "HH:MM"
  dwellScheduledMin: number;
}

/** Builds a full live schedule for a train from raw scheduled stops + a uniform current delay. */
export function buildSchedule(stops: RawStop[], currentDelayMin: number, baseConfidence: number): ScheduleEntry[] {
  let prev: Date | null = null;
  return stops.map((stop, idx) => {
    const scheduled = parseTimeToday(stop.scheduled, prev ?? undefined);
    prev = scheduled;
    const predicted = addMinutes(scheduled, currentDelayMin);
    // confidence decays gently the further out the prediction is
    const confidence = Math.max(60, Math.round(baseConfidence - idx * 2.2));
    return {
      stationCode: stop.stationCode,
      scheduled: scheduled.toISOString(),
      predicted: predicted.toISOString(),
      delayMin: currentDelayMin,
      confidence,
      arrived: false,
      dwellScheduledMin: stop.dwellScheduledMin,
      dwellActualMin: stop.dwellScheduledMin,
    };
  });
}

export function computeFactors(currentDelayMin: number, extra: EtaFactor[]): EtaFactor[] {
  const base: EtaFactor[] = [{ label: 'Existing running delay', minutes: currentDelayMin }];
  const combined = [...base, ...extra];
  return combined;
}

export function totalFactorMinutes(factors: EtaFactor[]): number {
  return factors.reduce((sum, f) => sum + f.minutes, 0);
}

export function distanceForStation(routeId: string, stationCode: string): number {
  const route = ROUTES[routeId];
  const idx = route.stations.indexOf(stationCode);
  return STATIONS[stationCode]?.distanceKm ?? 0;
}

export function progressPct(routeId: string, currentStationCode: string): number {
  const route = ROUTES[routeId];
  const totalDist = STATIONS[route.stations[route.stations.length - 1]].distanceKm;
  const currentDist = STATIONS[currentStationCode].distanceKm;
  return Math.min(100, Math.round((currentDist / totalDist) * 1000) / 10);
}

/** Interpolates a lat/lng position along a route's real geography from a cumulative distance value. */
export function interpolatePosition(routeId: string, distanceKm: number): { lat: number; lng: number; bearing: number } {
  const route = ROUTES[routeId];
  const stops = route.stations.map((code) => STATIONS[code]);
  let from = stops[0];
  let to = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (distanceKm >= stops[i].distanceKm && distanceKm <= stops[i + 1].distanceKm) {
      from = stops[i];
      to = stops[i + 1];
      break;
    }
  }
  const span = to.distanceKm - from.distanceKm || 1;
  const t = Math.min(1, Math.max(0, (distanceKm - from.distanceKm) / span));
  const lat = from.lat + (to.lat - from.lat) * t;
  const lng = from.lng + (to.lng - from.lng) * t;
  const bearing = (Math.atan2(to.lng - from.lng, to.lat - from.lat) * 180) / Math.PI;
  return { lat, lng, bearing };
}

export function statusFromDelay(delayMin: number): Train['status'] {
  if (delayMin <= 5) return 'on-time';
  if (delayMin <= 15) return 'delayed';
  if (delayMin > 25) return 'critical';
  return 'delayed';
}
