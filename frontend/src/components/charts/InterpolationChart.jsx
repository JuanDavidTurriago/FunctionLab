import { Line } from 'react-chartjs-2';
import { cartesianOptions } from './chartConfig';

export default function InterpolationChart({ chart }) {
  const data = {
    datasets: [
      {
        label: 'Polinomio interpolante',
        data: chart.curvePoints,
        borderColor: '#0f766e',
        backgroundColor: '#0f766e',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.08,
      },
      {
        label: 'Puntos conocidos',
        data: chart.inputPoints,
        borderColor: '#1d4ed8',
        backgroundColor: '#1d4ed8',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: false,
      },
      {
        label: 'Punto interpolado',
        data: [chart.evaluationPoint],
        borderColor: '#b91c1c',
        backgroundColor: '#b91c1c',
        pointStyle: 'rectRot',
        pointRadius: 7,
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
