import { Subject } from '@/types';
import { getGradeLetter, getGradeColor } from '@/utils/calculations/sgpaCalculator';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface GradeBarProps {
  subjects: Subject[];
}

export default function GradeBarChart({ subjects }: GradeBarProps) {
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

  const sorted = [...validSubjects].sort((a, b) => 
    parseFloat(b.grade as string) - parseFloat(a.grade as string)
  );

  const data = {
    labels: sorted.map(s => s.name),
    datasets: [
      {
        label: 'Grade Points',
        data: sorted.map(s => parseFloat(s.grade as string)),
        backgroundColor: sorted.map(s => {
          const g = parseFloat(s.grade as string);
          const color = getGradeColor(g);
          return color + '80'; // Add alpha
        }),
        borderColor: sorted.map(s => getGradeColor(parseFloat(s.grade as string))),
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        grid: { color: 'var(--border)' },
        ticks: { color: 'var(--ink-faint)' },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'var(--ink-mid)', font: { size: 9 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const grade = context.raw;
            const letter = getGradeLetter(grade);
            const credits = sorted[context.dataIndex]?.credits || '—';
            return `${letter} · ${grade} pts · ${credits} credits`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
