import { Line } from 'react-chartjs-2';
import { cartesianOptions } from './chartConfig';

export default function TaylorComparisonChart({ chart }) {
  const data = {
    datasets: [
      {
        label: 'Funcion original',
        data: chart.functionPoints,
        borderColor: '#0f766e',
        backgroundColor: '#0f766e',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Polinomio de Taylor',
        data: chart.polynomialPoints,
        borderColor: '#d97706',
        backgroundColor: '#d97706',
        borderDash: [8, 5],
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Centro de expansion',
        data: [chart.expansionPoint],
        borderColor: '#1d4ed8',
        backgroundColor: '#1d4ed8',
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Evaluacion real',
        data: [{ x: chart.evaluationPoint.x, y: chart.evaluationPoint.functionValue }],
        borderColor: '#15803d',
        backgroundColor: '#15803d',
        pointRadius: 6,
        showLine: false,
      },
      {
        label: 'Evaluacion aproximada',
        data: [{ x: chart.evaluationPoint.x, y: chart.evaluationPoint.polynomialValue }],
        borderColor: '#b91c1c',
        backgroundColor: '#b91c1c',
        pointStyle: 'rectRot',
        pointRadius: 6,
        showLine: false,
      },
    ],
  };

  return (
    <div className="chart-frame">
      <Line data={data} options={cartesianOptions} />
    </div>
  );
}
