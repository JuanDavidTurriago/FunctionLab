import { Line } from 'react-chartjs-2';
import { useTheme } from '../common/ThemeContext';
import { createCartesianOptions, getChartColors } from './chartConfig';

export default function InterpolationChart({ chart }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  // La curva es continua visualmente; los datos conocidos y evaluados se muestran como puntos.
  const data = {
    datasets: [
      {
        label: 'Polinomio interpolante',
        data: chart.curvePoints,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Puntos conocidos',
        data: chart.inputPoints,
        borderColor: colors.blue,
        backgroundColor: colors.blue,
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
      {
        label: 'Punto interpolado',
        data: [chart.evaluationPoint],
        borderColor: colors.danger,
        backgroundColor: colors.danger,
        pointStyle: 'rectRot',
        pointRadius: 7,
        showLine: false,
      },
    ],
  };

  return (
    <div className="chart-frame">
      <Line key={theme} data={data} options={createCartesianOptions(theme)} />
    </div>
  );
}
