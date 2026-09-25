import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import { Target, CheckCircle2, ShieldCheck, Gauge } from 'lucide-react';
import { ACCURACY_BY_HOUR, DELAY_DISTRIBUTION, PREDICTION_ERROR, AVG_DWELL_BY_STATION, DELAY_CAUSES } from '../data/historicalData';

const PIE_COLORS = ['#c8442c', '#d99a3d', '#3fb27f', '#4a9fd6', '#8592a3'];

const chartTheme = {
  grid: '#1d2530',
  axis: '#5c6779',
  tooltip: { background: '#141a23', border: '1px solid #232b38', borderRadius: 8, fontSize: 12 },
};

export default function Analytics() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-1">Analytics</h2>
        <p className="text-sm text-slate-500">Historical prediction accuracy — simulated demo data.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Mean Absolute Error" value="6.8 min" icon={Target} />
        <KPICard label="Within ±5 min" value="78%" icon={CheckCircle2} tone="ok" />
        <KPICard label="Within ±10 min" value="93%" icon={ShieldCheck} tone="ok" />
        <KPICard label="Prediction Confidence" value="89%" icon={Gauge} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="ETA Accuracy by Hour" sub="Average absolute error across the day">
          <LineChart data={ACCURACY_BY_HOUR} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="hour" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} unit="m" />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Line type="monotone" dataKey="errorMin" name="Error (min)" stroke="#c8442c" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Delay Distribution" sub="Share of journeys by delay bucket">
          <BarChart data={DELAY_DISTRIBUTION} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="bucket" stroke={chartTheme.axis} fontSize={10.5} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Bar dataKey="count" name="Journeys" fill="#c8442c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Prediction Error Trend" sub="Mean absolute error by day">
          <LineChart data={PREDICTION_ERROR} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={chartTheme.grid} vertical={false} />
            <XAxis dataKey="day" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} unit="m" />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Line type="monotone" dataKey="mae" name="MAE (min)" stroke="#4a9fd6" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Average Station Dwell" sub="Minutes spent halted, by station">
          <BarChart data={AVG_DWELL_BY_STATION} layout="vertical" margin={{ top: 4, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid stroke={chartTheme.grid} horizontal={false} />
            <XAxis type="number" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <YAxis type="category" dataKey="station" stroke={chartTheme.axis} fontSize={10.5} width={110} tickLine={false} axisLine={{ stroke: '#232b38' }} />
            <Tooltip contentStyle={chartTheme.tooltip} />
            <Bar dataKey="dwellMin" name="Dwell (min)" fill="#d99a3d" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      <ChartCard title="Delay Causes" sub="Share of total delay minutes by cause" tall>
        <PieChart>
          <Pie data={DELAY_CAUSES} dataKey="pct" nameKey="cause" cx="50%" cy="50%" outerRadius={90} label={(d) => `${d.cause} ${d.pct}%`} labelLine={false}>
            {DELAY_CAUSES.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTheme.tooltip} />
        </PieChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, sub, children, tall }: { title: string; sub: string; children: React.ReactElement; tall?: boolean }) {
  return (
    <div className="panel p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4">{sub}</p>
      <div className={tall ? 'h-80' : 'h-56'}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
