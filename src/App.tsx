import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LiveTrains from './pages/LiveTrains';
import ETAForecast from './pages/ETAForecast';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import SystemArchitecture from './pages/SystemArchitecture';
import PassengerView from './pages/PassengerView';

function ControlRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <HashRouter>
        <Routes>
          <Route path="/passenger" element={<PassengerView />} />
          <Route
            path="/*"
            element={
              <ControlRoomLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/live-trains" element={<LiveTrains />} />
                  <Route path="/eta-forecast" element={<ETAForecast />} />
                  <Route path="/simulation" element={<Simulation />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/system" element={<SystemArchitecture />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ControlRoomLayout>
            }
          />
        </Routes>
      </HashRouter>
    </SimulationProvider>
  );
}
