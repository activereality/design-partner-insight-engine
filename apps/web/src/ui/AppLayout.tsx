import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="app-frame">
      <header className="app-header">
        <div>
          <p className="codename">SignalForge</p>
          <h1>Design Partner Insight Engine</h1>
        </div>
        <nav aria-label="Primary navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
        </nav>
      </header>

      <div className="notice" role="note">
        Synthetic/demo data only. Do not enter real customer notes, private interview details, secrets, or credentials.
      </div>

      <Outlet />
    </div>
  );
}
