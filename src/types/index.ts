export type TrainStatus = 'on-time' | 'delayed' | 'critical' | 'recovering';

export interface Station {
  code: string;
  name: string;
  distanceKm: number; // cumulative distance from origin along this route
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  stations: string[]; // station codes in order
}

export interface ScheduleEntry {
  stationCode: string;
  scheduled: string; // ISO time string (today, simulated)
  predicted: string; // ISO time string
  delayMin: number;
  confidence: number; // 0-100
  arrived: boolean;
  dwellScheduledMin: number;
  dwellActualMin: number;
}

export interface EtaFactor {
  label: string;
  minutes: number; // positive = adds delay, negative = recovers time
}

export interface Train {
  trainNumber: string;
  trainName: string;
  routeId: string;
  originCode: string;
  destCode: string;
  currentStationCode: string; // last known / current station
  nextStationCode: string | null;
  progressPct: number; // 0-100 along whole route
  speedKmh: number;
  baseSpeedKmh: number;
  status: TrainStatus;
  currentDelayMin: number;
  distanceTravelledKm: number;
  distanceRemainingKm: number;
  direction: string;
  lastSignal: string;
  schedule: ScheduleEntry[];
  factors: EtaFactor[];
  confidence: number;
  lastUpdatedLabel: string;
}

export type EventType =
  | 'signal-delay'
  | 'congestion'
  | 'speed-restriction'
  | 'extended-halt'
  | 'increased-speed'
  | 'reset';

export interface SimEvent {
  id: string;
  type: EventType;
  trainNumber: string;
  sectionFrom: string;
  sectionTo: string;
  impactMin: number;
  timestamp: string;
  label: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  trainNumber: string;
  location: string;
  time: string;
  message: string;
  impactMin: number;
}
