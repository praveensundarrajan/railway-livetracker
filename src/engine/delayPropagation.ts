import type { AlertItem, EtaFactor, EventType, SimEvent, Train } from '../types';
import { STATIONS } from '../data/stations';
import { ROUTES } from '../data/routes';
import { addMinutes, formatTime, statusFromDelay, totalFactorMinutes } from './etaEngine';

interface EventDefinition {
  type: EventType;
  label: string;
  minImpact: number;
  maxImpact: number;
  factorLabel: string;
  speedDeltaKmh: number; // negative = slows down, positive = speeds up
  alertSeverity: AlertItem['severity'];
  alertVerb: string;
}

export const EVENT_DEFS: Record<Exclude<EventType, 'reset'>, EventDefinition> = {
  'signal-delay': {
    type: 'signal-delay',
    label: 'Signal Delay',
    minImpact: 2,
    maxImpact: 5,
    factorLabel: 'Signal delay',
    speedDeltaKmh: -8,
    alertSeverity: 'warning',
    alertVerb: 'Signal delay detected',
  },
  congestion: {
    type: 'congestion',
    label: 'Track Congestion',
    minImpact: 4,
    maxImpact: 10,
    factorLabel: 'Congestion',
    speedDeltaKmh: -15,
    alertSeverity: 'critical',
    alertVerb: 'Congestion detected',
  },
  'speed-restriction': {
    type: 'speed-restriction',
    label: 'Temporary Speed Restriction',
    minImpact: 3,
    maxImpact: 8,
    factorLabel: 'Speed restriction',
    speedDeltaKmh: -27,
    alertSeverity: 'warning',
    alertVerb: 'Speed restriction imposed',
  },
  'extended-halt': {
    type: 'extended-halt',
    label: 'Extended Station Halt',
    minImpact: 2,
    maxImpact: 6,
    factorLabel: 'Extended station dwell',
    speedDeltaKmh: 0,
    alertSeverity: 'warning',
    alertVerb: 'Extended halt recorded',
  },
  'increased-speed': {
    type: 'increased-speed',
    label: 'Increased Train Speed',
    minImpact: -6,
    maxImpact: -2,
    factorLabel: 'Speed recovery',
    speedDeltaKmh: 12,
    alertSeverity: 'info',
    alertVerb: 'ETA recovered',
  },
};

function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export interface EventResult {
  train: Train;
  event: SimEvent;
  alert: AlertItem;
}

export function applyEvent(train: Train, type: Exclude<EventType, 'reset'>, nowLabel: string): EventResult {
  const def = EVENT_DEFS[type];
  const impactMin = randomInRange(def.minImpact, def.maxImpact);

  const route = ROUTES[train.routeId];
  const currentIdx = route.stations.indexOf(train.currentStationCode);
  const nextCode = route.stations[currentIdx + 1] ?? null;
  const sectionFrom = STATIONS[train.currentStationCode]?.name ?? train.currentStationCode;
  const sectionTo = nextCode ? STATIONS[nextCode].name : sectionFrom;

  const newDelay = Math.max(0, train.currentDelayMin + impactMin);
  const newSpeed = Math.max(20, Math.min(130, train.speedKmh + def.speedDeltaKmh));

  const newFactor: EtaFactor = { label: def.factorLabel, minutes: impactMin };
  const factors = [...train.factors, newFactor];

  // Recompute downstream schedule: any station not yet arrived gets shifted by impactMin,
  // with confidence nudged down slightly to reflect new uncertainty.
  const schedule = train.schedule.map((entry) => {
    if (entry.arrived) return entry;
    const predicted = addMinutes(new Date(entry.predicted), impactMin);
    const confidence = Math.max(55, Math.round(entry.confidence - Math.abs(impactMin) * 0.6));
    return {
      ...entry,
      predicted: predicted.toISOString(),
      delayMin: entry.delayMin + impactMin,
      confidence,
    };
  });

  const overallConfidence = Math.max(
    55,
    Math.round(schedule.reduce((s, e) => s + e.confidence, 0) / Math.max(1, schedule.length))
  );

  const updatedTrain: Train = {
    ...train,
    currentDelayMin: newDelay,
    speedKmh: newSpeed,
    status: statusFromDelay(newDelay),
    factors,
    schedule,
    confidence: overallConfidence,
    lastUpdatedLabel: 'Prediction updated just now',
    lastSignal: type === 'congestion' ? 'Restricted' : type === 'signal-delay' ? 'Caution' : train.lastSignal,
  };

  const event: SimEvent = {
    id: `${train.trainNumber}-${type}-${Date.now()}`,
    type,
    trainNumber: train.trainNumber,
    sectionFrom,
    sectionTo,
    impactMin,
    timestamp: nowLabel,
    label: def.label,
  };

  const alert: AlertItem = {
    id: `alert-${event.id}`,
    severity: def.alertSeverity,
    trainNumber: train.trainNumber,
    location: `${sectionFrom} → ${sectionTo}`,
    time: nowLabel,
    message: def.alertVerb,
    impactMin,
  };

  return { train: updatedTrain, event, alert };
}

export function resetTrain(base: Train): Train {
  return { ...base, lastUpdatedLabel: 'Simulation reset' };
}

export function buildAiInsight(train: Train): string {
  const nextEntry = train.schedule.find((e) => !e.arrived);
  const total = totalFactorMinutes(train.factors);
  const lastFactor = train.factors[train.factors.length - 1];
  const stationName = nextEntry ? STATIONS[nextEntry.stationCode].name : train.destCode;
  const etaStr = nextEntry ? formatTime(new Date(nextEntry.predicted)) : '—';

  if (train.factors.length <= 1) {
    return `Train ${train.trainNumber} is running ${
      train.currentDelayMin <= 1 ? 'on schedule' : `${train.currentDelayMin} minutes behind schedule`
    }. Based on current speed and historical section performance, the next predicted arrival at ${stationName} is ${etaStr}.`;
  }

  return `Train ${train.trainNumber} is currently ${train.currentDelayMin} minutes behind schedule. Based on current speed, historical section performance and a detected ${lastFactor.label.toLowerCase()} event, the model estimates a total impact of ${total} minutes. The predicted arrival at ${stationName} has shifted to ${etaStr}.`;
}
