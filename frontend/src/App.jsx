import { NavLink, Route, Routes } from 'react-router-dom';
import Taylor from './pages/Taylor';
import Conversion from './pages/Conversion';
import Ecuaciones from './pages/Ecuaciones';
import Sistemas from './pages/Sistemas';
import Interpolacion from './pages/Interpolacion';
import { navItems } from './utils/navItems';

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>FunctionLab</h1>
        <p>Aplicacion fullstack para metodos numericos con frontend React y backend Express.</p>

        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Taylor />} />
          <Route path="/conversion" element={<Conversion />} />
          <Route path="/ecuaciones" element={<Ecuaciones />} />
          <Route path="/sistemas" element={<Sistemas />} />
          <Route path="/interpolacion" element={<Interpolacion />} />
        </Routes>
      </main>
    </div>
  );
}
