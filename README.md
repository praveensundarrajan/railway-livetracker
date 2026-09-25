# RailPredict AI

**Dynamic Forecast of Expected Time of Arrival (ETA) for Coaching Trains**
Prototype for Smart India Hackathon 2026 — Problem Statement **SIH26028** (Ministry of Railways)

## What it does

RailPredict AI doesn't just track where a train is — it continuously predicts where it will be, and updates that prediction live whenever railway conditions change (congestion, signal delays, speed restrictions, extended halts). Triggering an event in the Simulation Center recalculates the affected train's ETA and propagates the new delay to every downstream station, with the map, tables, charts, alerts and AI explanation all updating together.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Pages

- **Overview** — KPIs, live real-world map (OpenStreetMap/CARTO dark tiles via Leaflet) with the Chennai↔Hyderabad corridor, moving train markers, and a quick-stat side panel, plus the full train detail panel
- **Live Trains** — full fleet table
- **ETA Forecast** — per-station scheduled vs. predicted times with confidence bars, and a factor-contribution breakdown
- **Simulation Center** — trigger Signal Delay, Track Congestion, Speed Restriction, Extended Halt, Increased Speed, or Reset; watch delay propagate downstream in real time; **Start Demo** runs a scripted 10–12 second walkthrough for judges
- **Analytics** — accuracy and delay-cause charts (simulated historical data, clearly labeled)
- **Alerts** — live alert feed + event log
- **System** — architecture pipeline diagram
- **Passenger View** (`#/passenger`) — a simplified, rider-facing ETA lookup

## Notes for judges

- All data is simulated locally — no external railway/GPS/weather APIs or keys are required.
- The "ETA Prediction Engine" panel is clearly labeled as using simulated telemetry, not a live-trained model.
- Every event button changes real application state (delay, speed, confidence, downstream schedule) rather than swapping static numbers.

## Stack

React + TypeScript + Vite + Tailwind CSS + Recharts + Leaflet/React-Leaflet (standard OpenStreetMap raster tiles, recolored dark with a CSS filter — no API key needed) + Lucide icons, with a self-contained simulation/prediction engine in `src/engine/`.

The map needs an internet connection in the browser to load basemap tiles (same as any Leaflet/Google Maps app) — everything else in the prototype works fully offline.
