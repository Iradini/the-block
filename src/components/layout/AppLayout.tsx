import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
