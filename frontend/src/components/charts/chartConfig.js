import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

// Chart.js requiere registrar explicitamente los elementos usados por las graficas.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Configuracion cartesiana compartida para mantener escalas y estilos consistentes.
export const cartesianOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  scales: {
    x: {
      type: 'linear',
      grid: {
        color: 'rgba(62, 84, 108, 0.12)',
      },
      title: {
        display: true,
        text: 'x',
      },
    },
    y: {
      grid: {
        color: (context) => (context.tick.value === 0 ? '#64748b' : 'rgba(62, 84, 108, 0.12)'),
        lineWidth: (context) => (context.tick.value === 0 ? 1.5 : 1),
      },
      title: {
        display: true,
        text: 'y',
      },
    },
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  },
};
