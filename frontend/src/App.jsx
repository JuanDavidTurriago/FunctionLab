import { useLayoutEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/common/ThemeContext';
import Taylor from './pages/Taylor';
import Conversion from './pages/Conversion';
import Ecuaciones from './pages/Ecuaciones';
import Sistemas from './pages/Sistemas';
import Interpolacion from './pages/Interpolacion';
import { navItems } from './utils/navItems';

const getInitialTheme = () => {
  const savedTheme = window.localStorage.getItem('functionlab-theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const NavigationIcon = ({ name }) => {
  const paths = {
    taylor: <path d="M4 18c3.5-8 5.5-8 8-1s4.5 7 8-3M4 6h5M6.5 3.5v5" />,
    conversion: <path d="M7 7h12l-3-3m3 3-3 3M17 17H5l3 3m-3-3 3-3" />,
    ecuaciones: <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />,
    sistemas: <path d="M5 6h14M5 12h14M5 18h14M8 4v4M16 10v4M11 16v4" />,
    interpolacion: <path d="M4 18 9 12l4 3 7-10M4 18h16" />,
  };

  return (
    <svg aria-hidden="true" className="nav-icon" fill="none" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

const ThemeIcon = ({ theme }) => (
  <svg aria-hidden="true" className="theme-icon" fill="none" viewBox="0 0 24 24">
    {theme === 'light' ? (
      <>
        <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        <circle cx="12" cy="12" r="4" />
      </>
    ) : (
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />
    )}
  </svg>
);

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('functionlab-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-mark">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="M3 12h4l2.2-7 4.3 14L16 12h5" />
              </svg>
            </span>
            <div>
              <h1>FunctionLab</h1>
              <span>Numerical workspace</span>
            </div>
          </div>

          <div className="sidebar-section-label">Metodos</div>
          <nav className="nav-links">
            {/* El menu se genera desde una sola configuracion para evitar duplicar rutas y etiquetas. */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <NavigationIcon name={item.icon} />
                <span>{item.label}</span>
                <svg aria-hidden="true" className="nav-chevron" fill="none" viewBox="0 0 24 24">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button
              className="theme-toggle"
              type="button"
              aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              aria-pressed={theme === 'dark'}
              onClick={toggleTheme}
            >
              <ThemeIcon theme={theme} />
              <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
            </button>
          </div>
        </aside>

        <main className="content">
          {/* React Router decide que modulo matematico se muestra segun la URL. */}
          <Routes>
            <Route path="/" element={<Taylor />} />
            <Route path="/conversion" element={<Conversion />} />
            <Route path="/ecuaciones" element={<Ecuaciones />} />
            <Route path="/sistemas" element={<Sistemas />} />
            <Route path="/interpolacion" element={<Interpolacion />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}
