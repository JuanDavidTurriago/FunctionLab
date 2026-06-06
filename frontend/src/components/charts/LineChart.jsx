import { Line } from 'react-chartjs-2';
import './chartConfig';

export default function LineChart({ labels = [], values = [], label = 'Serie' }) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: '#1261a0',
        backgroundColor: 'rgba(18, 97, 160, 0.15)',
        tension: 0.25,
      },
    ],
  };

  return <Line data={data} />;
}
