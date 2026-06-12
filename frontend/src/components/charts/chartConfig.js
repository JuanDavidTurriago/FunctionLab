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

export const getChartColors = (theme) => ({
  primary: theme === 'dark' ? '#0ee07f' : '#0f766e',
  secondary: theme === 'dark' ? '#fbbf24' : '#d97706',
  blue: theme === 'dark' ? '#60a5fa' : '#2563eb',
  violet: theme === 'dark' ? '#c084fc' : '#7c3aed',
  danger: theme === 'dark' ? '#fb7185' : '#b91c1c',
  green: theme === 'dark' ? '#34d399' : '#15803d',
  text: theme === 'dark' ? '#ffffff' : '#000000',
  grid: theme === 'dark' ? 'rgba(148, 163, 184, 0.13)' : 'rgba(83, 97, 118, 0.12)',
  axis: theme === 'dark' ? '#64748b' : '#94a3b8',
  tooltip: theme === 'dark' ? '#0c121d' : '#172033',
  pointSurface: theme === 'dark' ? '#151b29' : '#ffffff',
});

const createScale = (theme, title, type) => {
  const colors = getChartColors(theme);

  return {
    ...(type ? { type } : {}),
    border: {
      color: colors.axis,
    },
    grid: {
      color: (context) => (context.tick.value === 0 ? colors.axis : colors.grid),
      lineWidth: (context) => (context.tick.value === 0 ? 1.4 : 1),
    },
    ticks: {
      color: colors.text,
      padding: 7,
      font: {
        family: 'Segoe UI Variable Text, Segoe UI, sans-serif',
        size: 12,
        weight: 500,
        lineHeight: 1.25,
      },
    },
    title: {
      display: true,
      text: title,
      color: colors.text,
      font: {
        family: 'Segoe UI Variable Text, Segoe UI, sans-serif',
        size: 12,
        weight: 600,
        lineHeight: 1.25,
      },
    },
  };
};

const createBaseOptions = (theme) => {
  const colors = getChartColors(theme);

  return {
    responsive: true,
    maintainAspectRatio: false,
    // Dos pixeles fisicos por pixel CSS mejoran la nitidez del texto del canvas.
    devicePixelRatio: 2,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.text,
          usePointStyle: true,
          boxWidth: 9,
          padding: 18,
          font: {
            family: 'Segoe UI Variable Text, Segoe UI, sans-serif',
            size: 12,
            weight: 500,
            lineHeight: 1.25,
          },
        },
      },
      tooltip: {
        backgroundColor: colors.tooltip,
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: colors.axis,
        borderWidth: 1,
        padding: 11,
        titleFont: {
          family: 'Segoe UI Variable Text, Segoe UI, sans-serif',
          size: 12,
          weight: 600,
        },
        bodyFont: {
          family: 'Segoe UI Variable Text, Segoe UI, sans-serif',
          size: 12,
          weight: 400,
        },
      },
    },
  };
};

// Las opciones se regeneran al cambiar de tema porque Chart.js dibuja sobre canvas.
export const createCartesianOptions = (theme) => ({
  ...createBaseOptions(theme),
  scales: {
    x: createScale(theme, 'x', 'linear'),
    y: createScale(theme, 'y'),
  },
});

export const createCategoryOptions = (theme) => ({
  ...createBaseOptions(theme),
  scales: {
    x: createScale(theme, 'Orden'),
    y: createScale(theme, 'Aproximacion'),
  },
});
