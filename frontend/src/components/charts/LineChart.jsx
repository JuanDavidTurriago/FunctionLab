import { Line } from 'react-chartjs-2';
import { useTheme } from '../common/ThemeContext';
import { createCategoryOptions, getChartColors } from './chartConfig';

export default function LineChart({ labels = [], values = [], label = 'Serie' }) {
  const { theme } = useTheme();
  const colors = getChartColors(theme);
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        pointBackgroundColor: colors.pointSurface,
        pointBorderColor: colors.primary,
        pointRadius: 4,
        borderWidth: 2.5,
        tension: 0.25,
      },
    ],
  };

  return <Line key={theme} data={data} options={createCategoryOptions(theme)} />;
}
