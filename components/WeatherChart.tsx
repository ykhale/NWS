import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeatherChartProps {
  labels: string[];
  data: number[];
}

const WeatherChart = ({ labels, data }: WeatherChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Number of Alerts',
        data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default WeatherChart; 