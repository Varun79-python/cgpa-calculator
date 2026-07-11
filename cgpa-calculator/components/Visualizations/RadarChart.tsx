import { Subject } from '@/types';
import { getGradeLetter, getGradeColor } from '@/utils/calculations/sgpaCalculator';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  subjects: Subject[];
}

export default function RadarChartView({ subjects }: RadarChartProps) {
  const validSubjects = subjects.filter(s => {
    const g = parseFloat(s.grade as string);
    return !isNaN(g) && g > 0 && s.name;
  });

  if (validSubjects.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--ink-faint)] text-sm">
        No subject data to visualize
      </div>
    );
  }

  const data = {
    labels: validSubjects.map(s => s.name),
    datasets: [
      {
        label: 'Grade Points',
        data: validSubjects.map(s => parseFloat(s.grade as string)),
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        borderColor: 'rgba(108, 99, 255, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: validSubjects.map(s => getGradeColor(parseFloat(s.grade as string))),
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          color: 'var(--ink-faint)',
          backdropColor: 'transparent',
        },
        grid: {
          color: 'var(--border)',
        },
        angleLines: {
          color: 'var(--border)',
        },
        pointLabels: {
          color: 'var(--ink-mid)',
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const grade = context.raw;
            const letter = getGradeLetter(grade);
            return `${letter} (${grade})`;
          },
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}
