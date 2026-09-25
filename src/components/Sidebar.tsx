import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrainFront,
  Clock,
  PlayCircle,
  BarChart3,
  BellRing,
  Network,
  TrainTrack,
  Users,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/live-trains', label: 'Live Trains', icon: TrainFront },
  { to: '/eta-forecast', label: 'ETA Forecast', icon: Clock },
  { to: '/simulation', label: 'Simulation', icon: PlayCircle },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/alerts', label: 'Alerts', icon: BellRing },
  { to: '/system', label: 'System', icon: Network },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-navy-900 border-r border-white/[0.06] flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-md bg-rail-red/90 flex items-center justify-center shrink-0">
          <TrainTrack size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-slate-100">RailPredict AI</div>
          <div className="text-[10px] text-slate-500 font-mono">SIH26028</div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-white/[0.07] text-slate-50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`
            }
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </NavLink>
        ))}

        <a
          href="#/passenger"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-colors mt-1"
        >
          <Users size={16} strokeWidth={2} />
          Passenger View
        </a>
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-500">
        <span className="status-dot bg-ok pulse-live" />
        System Operational
      </div>
    </aside>
  );
}
