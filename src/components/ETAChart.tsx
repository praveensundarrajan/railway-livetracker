import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATIONS } from '../data/stations';
import type { Train } from '../types';

export default function ETAChart({ train }: { train: Train }) {
  const data = train.schedule.map((e) => ({
    station: STATIONS[e.stationCode].code,
    Scheduled: Math.round((new Date(e.scheduled).getTime() - new Date(train.schedule[0].scheduled).getTime()) / 60000),
    Predicted: Math.round((new Date(e.predicted).getTime() - new Date(train.schedule[0].scheduled).getTime()) / 60000),
  }));

  return (
    <div className="panel p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">ETA Timeline</h3>
      <p className="text-xs text-slate-500 mb-4">Minutes elapsed since departure — scheduled vs. predicted</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#1d2530" vertical={false} />
            <XAxis dataKey="station" stroke="#5c6779" fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <YAxis stroke="#5c6779" fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} unit="m" />
            <Tooltip
              contentStyle={{ background: '#141a23', border: '1px solid #232b38', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#9aa5b3' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9aa5b3' }} />
            <Line type="monotone" dataKey="Scheduled" stroke="#5c6779" strokeWidth={2} dot={false} strokeDasharray="4 3" />
            <Line type="monotone" dataKey="Predicted" stroke="#c8442c" strokeWidth={2.5} dot={{ r: 3, fill: '#c8442c' }} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
