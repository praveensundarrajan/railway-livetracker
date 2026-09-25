import type { EtaFactor, Train } from '../types';
import { buildSchedule, distanceForStation, progressPct, statusFromDelay, type RawStop } from '../engine/etaEngine';
import { ROUTES } from '../data/routes';
import { STATIONS } from '../data/stations';

function makeTrain(params: {
  trainNumber: string;
  trainName: string;
  routeId: string;
  currentStationCode: string;
  speedKmh: number;
  baseSpeedKmh: number;
  currentDelayMin: number;
  direction: string;
  lastSignal: string;
  stops: RawStop[];
  extraFactors?: EtaFactor[];
  confidence: number;
}): Train {
  const route = ROUTES[params.routeId];
  const currentIdx = route.stations.indexOf(params.currentStationCode);
  const nextStationCode = route.stations[currentIdx + 1] ?? null;
  const schedule = buildSchedule(params.stops, params.currentDelayMin, params.confidence).map((entry, idx) => ({
    ...entry,
    arrived: idx <= currentIdx,
  }));
  const distTravelled = distanceForStation(params.routeId, params.currentStationCode);
  const totalDist = STATIONS[route.stations[route.stations.length - 1]].distanceKm;

  return {
    trainNumber: params.trainNumber,
    trainName: params.trainName,
    routeId: params.routeId,
    originCode: route.stations[0],
    destCode: route.stations[route.stations.length - 1],
    currentStationCode: params.currentStationCode,
    nextStationCode,
    progressPct: progressPct(params.routeId, params.currentStationCode),
    speedKmh: params.speedKmh,
    baseSpeedKmh: params.baseSpeedKmh,
    status: statusFromDelay(params.currentDelayMin),
    currentDelayMin: params.currentDelayMin,
    distanceTravelledKm: distTravelled,
    distanceRemainingKm: Math.max(0, totalDist - distTravelled),
    direction: params.direction,
    lastSignal: params.lastSignal,
    schedule,
    factors: [{ label: 'Existing running delay', minutes: params.currentDelayMin }, ...(params.extraFactors ?? [])],
    confidence: params.confidence,
    lastUpdatedLabel: 'Prediction updated 3 seconds ago',
  };
}

export function buildInitialTrains(): Train[] {
  return [
    makeTrain({
      trainNumber: '12603',
      trainName: 'Hyderabad Express',
      routeId: 'MAS-HYB',
      currentStationCode: 'KPD',
      speedKmh: 72,
      baseSpeedKmh: 85,
      currentDelayMin: 14,
      direction: 'North-West',
      lastSignal: 'Clear',
      confidence: 96,
      stops: [
        { stationCode: 'MAS', scheduled: '19:15', dwellScheduledMin: 0 },
        { stationCode: 'AJJ', scheduled: '20:12', dwellScheduledMin: 2 },
        { stationCode: 'KPD', scheduled: '21:20', dwellScheduledMin: 3 },
        { stationCode: 'JTJ', scheduled: '21:34', dwellScheduledMin: 2 },
        { stationCode: 'BNC', scheduled: '23:03', dwellScheduledMin: 5 },
        { stationCode: 'DPJ', scheduled: '00:50', dwellScheduledMin: 2 },
        { stationCode: 'SA', scheduled: '01:58', dwellScheduledMin: 3 },
        { stationCode: 'ED', scheduled: '02:45', dwellScheduledMin: 2 },
        { stationCode: 'KPG', scheduled: '03:20', dwellScheduledMin: 2 },
        { stationCode: 'SC', scheduled: '04:05', dwellScheduledMin: 3 },
        { stationCode: 'HYB', scheduled: '04:25', dwellScheduledMin: 0 },
      ],
    }),
    makeTrain({
      trainNumber: '12608',
      trainName: 'Lalbagh Express',
      routeId: 'MAS-HYB',
      currentStationCode: 'AJJ',
      speedKmh: 64,
      baseSpeedKmh: 80,
      currentDelayMin: 22,
      direction: 'North-West',
      lastSignal: 'Caution',
      confidence: 88,
      stops: [
        { stationCode: 'MAS', scheduled: '20:00', dwellScheduledMin: 0 },
        { stationCode: 'AJJ', scheduled: '20:57', dwellScheduledMin: 2 },
        { stationCode: 'KPD', scheduled: '22:05', dwellScheduledMin: 2 },
        { stationCode: 'JTJ', scheduled: '22:20', dwellScheduledMin: 2 },
        { stationCode: 'BNC', scheduled: '23:55', dwellScheduledMin: 5 },
        { stationCode: 'DPJ', scheduled: '01:35', dwellScheduledMin: 2 },
        { stationCode: 'SA', scheduled: '02:40', dwellScheduledMin: 3 },
      ],
    }),
    makeTrain({
      trainNumber: '12786',
      trainName: 'Kacheguda Express',
      routeId: 'MAS-HYB',
      currentStationCode: 'BNC',
      speedKmh: 91,
      baseSpeedKmh: 88,
      currentDelayMin: 3,
      direction: 'North-West',
      lastSignal: 'Clear',
      confidence: 97,
      extraFactors: [{ label: 'Speed recovery', minutes: -3 }],
      stops: [
        { stationCode: 'MAS', scheduled: '17:40', dwellScheduledMin: 0 },
        { stationCode: 'AJJ', scheduled: '18:37', dwellScheduledMin: 2 },
        { stationCode: 'KPD', scheduled: '19:42', dwellScheduledMin: 2 },
        { stationCode: 'JTJ', scheduled: '19:58', dwellScheduledMin: 2 },
        { stationCode: 'BNC', scheduled: '21:20', dwellScheduledMin: 5 },
        { stationCode: 'DPJ', scheduled: '23:05', dwellScheduledMin: 2 },
        { stationCode: 'SA', scheduled: '00:12', dwellScheduledMin: 3 },
        { stationCode: 'ED', scheduled: '01:00', dwellScheduledMin: 2 },
        { stationCode: 'KPG', scheduled: '01:35', dwellScheduledMin: 2 },
        { stationCode: 'SC', scheduled: '02:15', dwellScheduledMin: 3 },
        { stationCode: 'HYB', scheduled: '02:35', dwellScheduledMin: 0 },
      ],
    }),
    makeTrain({
      trainNumber: '12639',
      trainName: 'Brindavan Express',
      routeId: 'MAS-HYB',
      currentStationCode: 'MAS',
      speedKmh: 0,
      baseSpeedKmh: 82,
      currentDelayMin: 0,
      direction: 'Stabled',
      lastSignal: 'Clear',
      confidence: 99,
      stops: [
        { stationCode: 'MAS', scheduled: '22:10', dwellScheduledMin: 0 },
        { stationCode: 'AJJ', scheduled: '23:07', dwellScheduledMin: 2 },
        { stationCode: 'KPD', scheduled: '00:15', dwellScheduledMin: 2 },
        { stationCode: 'JTJ', scheduled: '00:30', dwellScheduledMin: 2 },
        { stationCode: 'BNC', scheduled: '02:00', dwellScheduledMin: 5 },
      ],
    }),
    makeTrain({
      trainNumber: '17209',
      trainName: 'Rayalaseema Express',
      routeId: 'MAS-BZA',
      currentStationCode: 'RU',
      speedKmh: 58,
      baseSpeedKmh: 78,
      currentDelayMin: 31,
      direction: 'North',
      lastSignal: 'Restricted',
      confidence: 79,
      extraFactors: [
        { label: 'Congestion', minutes: 9 },
        { label: 'Station dwell pattern', minutes: 3 },
      ],
      stops: [
        { stationCode: 'MAS', scheduled: '18:30', dwellScheduledMin: 0 },
        { stationCode: 'RU', scheduled: '20:40', dwellScheduledMin: 3 },
        { stationCode: 'GDR', scheduled: '21:55', dwellScheduledMin: 2 },
        { stationCode: 'NLR', scheduled: '22:50', dwellScheduledMin: 2 },
        { stationCode: 'BZA', scheduled: '01:10', dwellScheduledMin: 0 },
      ],
    }),
  ];
}
