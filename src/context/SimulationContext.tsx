import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { AlertItem, EventType, SimEvent, Train } from '../types';
import { buildInitialTrains } from '../data/trains';
import { applyEvent } from '../engine/delayPropagation';
import { SIM_START, formatClock } from '../engine/etaEngine';

interface SimulationContextValue {
  trains: Train[];
  selectedTrainNumber: string;
  selectedTrain: Train | undefined;
  selectTrain: (trainNumber: string) => void;
  events: SimEvent[];
  alerts: AlertItem[];
  clock: Date;
  clockLabel: string;
  paused: boolean;
  togglePause: () => void;
  triggerEvent: (type: Exclude<EventType, 'reset'>) => void;
  resetSimulation: () => void;
  demoRunning: boolean;
  startDemo: () => void;
  stopDemo: () => void;
  lastEventImpact: { type: string; impactMin: number; section: string } | null;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

const initialTrains = buildInitialTrains();

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12603');
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'seed-1',
      severity: 'info',
      trainNumber: '12786',
      location: 'Bengaluru Cant.',
      time: formatClock(SIM_START),
      message: 'ETA recovered',
      impactMin: -3,
    },
  ]);
  const [clock, setClock] = useState<Date>(SIM_START);
  const [paused, setPaused] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [lastEventImpact, setLastEventImpact] = useState<SimulationContextValue['lastEventImpact']>(null);
  const demoTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setClock((prev) => (paused ? prev : new Date(prev.getTime() + 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const selectTrain = useCallback((trainNumber: string) => setSelectedTrainNumber(trainNumber), []);

  const triggerEvent = useCallback(
    (type: Exclude<EventType, 'reset'>) => {
      setTrains((prev) => {
        const idx = prev.findIndex((t) => t.trainNumber === selectedTrainNumber);
        if (idx === -1) return prev;
        const nowLabel = formatClock(new Date());
        const { train, event, alert } = applyEvent(prev[idx], type, nowLabel);
        setEvents((e) => [event, ...e].slice(0, 30));
        setAlerts((a) => [alert, ...a].slice(0, 30));
        setLastEventImpact({ type: event.label, impactMin: event.impactMin, section: `${event.sectionFrom} → ${event.sectionTo}` });
        const next = [...prev];
        next[idx] = train;
        return next;
      });
    },
    [selectedTrainNumber]
  );

  const resetSimulation = useCallback(() => {
    setTrains(buildInitialTrains());
    setEvents([]);
    setLastEventImpact(null);
    setClock(SIM_START);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const stopDemo = useCallback(() => {
    demoTimeouts.current.forEach(clearTimeout);
    demoTimeouts.current = [];
    setDemoRunning(false);
  }, []);

  const startDemo = useCallback(() => {
    stopDemo();
    resetSimulation();
    setSelectedTrainNumber('12603');
    setDemoRunning(true);

    const schedule: Array<{ delay: number; action: () => void }> = [
      { delay: 1200, action: () => triggerEvent('congestion') },
      { delay: 5200, action: () => triggerEvent('signal-delay') },
      { delay: 9200, action: () => triggerEvent('increased-speed') },
    ];

    schedule.forEach(({ delay, action }) => {
      demoTimeouts.current.push(setTimeout(action, delay));
    });
    demoTimeouts.current.push(
      setTimeout(() => setDemoRunning(false), 12500)
    );
  }, [resetSimulation, stopDemo, triggerEvent]);

  useEffect(() => () => demoTimeouts.current.forEach(clearTimeout), []);

  const selectedTrain = trains.find((t) => t.trainNumber === selectedTrainNumber);

  const value: SimulationContextValue = {
    trains,
    selectedTrainNumber,
    selectedTrain,
    selectTrain,
    events,
    alerts,
    clock,
    clockLabel: formatClock(clock),
    paused,
    togglePause,
    triggerEvent,
    resetSimulation,
    demoRunning,
    startDemo,
    stopDemo,
    lastEventImpact,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
