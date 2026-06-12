import { Line } from 'react-chartjs-2';
import { useTheme } from '../common/ThemeContext';
import { createCartesianOptions, getChartColors } from './chartConfig';

export default function TaylorComparisonChart({ chart }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  // Se superponen funcion, polinomio y puntos de referencia en los mismos ejes.
  const data = {
    datasets: [
      {
        label: 'Funcion original',
        data: chart.functionPoints,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Polinomio de Taylor',
        data: chart.polynomialPoints,
        borderColor: colors.secondary,
        backgroundColor: colors.secondary,
        borderDash: [8, 5],
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Centro de expansion',
        data: [chart.expansionPoint],
        borderColor: colors.blue,
        backgroundColor: colors.blue,
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Evaluacion real',
        data: [{ x: chart.evaluationPoint.x, y: chart.evaluationPoint.functionValue }],
        borderColor: colors.green,
        backgroundColor: colors.green,
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Evaluacion aproximada',
        data: [{ x: chart.evaluationPoint.x, y: chart.evaluationPoint.polynomialValue }],
        borderColor: colors.danger,
        backgroundColor: colors.danger,
        pointStyle: 'rectRot',
        pointRadius: 6,
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
