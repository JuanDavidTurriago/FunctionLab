import { Line } from 'react-chartjs-2';
import { useTheme } from '../common/ThemeContext';
import { createCartesianOptions, getChartColors } from './chartConfig';

const flattenSegments = (segments) => {
  const gap = { x: Number.NaN, y: Number.NaN };
  return segments.flatMap((segment, index) => (index === 0 ? segment : [gap, ...segment]));
};

const formatCoordinate = (value) => Number(value.toFixed(6));

export default function SystemIntersectionChart({ chart }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const trajectory = [chart.initialPoint, ...chart.iterationPoints];
  const data = {
    datasets: [
      {
        label: 'f1(x,y) = 0',
        data: flattenSegments(chart.firstContour),
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderWidth: 2.5,
        pointRadius: 0,
        spanGaps: false,
      },
      {
        label: 'f2(x,y) = 0',
        data: flattenSegments(chart.secondContour),
        borderColor: colors.secondary,
        backgroundColor: colors.secondary,
        borderWidth: 2.5,
        pointRadius: 0,
        spanGaps: false,
      },
      {
        label: 'Trayectoria de Newton',
        data: trajectory,
        borderColor: colors.blue,
        backgroundColor: colors.blue,
        borderDash: [6, 4],
        borderWidth: 1.75,
        pointRadius: 4,
        pointHoverRadius: 6,
        showLine: true,
      },
      {
        label: 'Puntos de corte',
        data: chart.intersections,
        borderColor: colors.danger,
        backgroundColor: colors.danger,
        pointStyle: 'rectRot',
        pointRadius: 7,
        pointHoverRadius: 9,
        showLine: false,
      },
      {
        label: 'Solucion encontrada',
        data: [chart.solutionPoint],
        borderColor: colors.violet,
        backgroundColor: colors.pointSurface,
        borderWidth: 3,
        pointRadius: 9,
        pointHoverRadius: 11,
        showLine: false,
      },
    ],
  };

  const cartesianOptions = createCartesianOptions(theme);
  const options = {
    ...cartesianOptions,
    animation: false,
    scales: {
      x: {
        ...cartesianOptions.scales.x,
        min: chart.bounds.minX,
        max: chart.bounds.maxX,
      },
      y: {
        ...cartesianOptions.scales.y,
        min: chart.bounds.minY,
        max: chart.bounds.maxY,
      },
    },
    plugins: {
      ...cartesianOptions.plugins,
      tooltip: {
        ...cartesianOptions.plugins.tooltip,
        callbacks: {
          label: (context) => {
            const point = context.raw;

            if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
              return context.dataset.label;
            }

            return `${context.dataset.label}: (${formatCoordinate(point.x)}, ${formatCoordinate(point.y)})`;
          },
        },
      },
    },
  };

  return (
    <div className="system-chart-layout">
      <div className="chart-frame system-chart-frame">
        <Line key={theme} data={data} options={options} />
      </div>

      <div className="intersection-list">
        <h4>Puntos de corte detectados</h4>
        <div className="intersection-pills">
          {chart.intersections.map((point, index) => (
            <span key={`${point.x}-${point.y}`}>
              P{index + 1} = ({formatCoordinate(point.x)}, {formatCoordinate(point.y)})
            </span>
          ))}
        </div>
        <p>
          Newton converge al punto marcado en violeta desde el valor inicial seleccionado.
        </p>
      </div>
    </div>
  );
}
