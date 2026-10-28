import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarMetricChart({ topRecommendations }) {
  if (!topRecommendations || topRecommendations.length === 0) return null;

  // Take top 3 recommendations for radar clarity
  const items = topRecommendations.slice(0, 3);

  const colors = [
    { border: '#16a34a', bg: 'rgba(22, 163, 74, 0.2)' }, // Emerald
    { border: '#2563eb', bg: 'rgba(37, 99, 235, 0.15)' }, // Blue
    { border: '#9333ea', bg: 'rgba(147, 51, 234, 0.15)' }  // Purple
  ];

  const labels = [
    'Moisture Barrier',
    'Oxygen Barrier',
    'UV / Light Shield',
    'Grease Resistance',
    'Eco Sustainability',
    'Cost Efficiency'
  ];

  const datasets = items.map((rec, index) => {
    const s = rec.scores || {};
    const color = colors[index % colors.length];

    return {
      label: `#${rec.rank} ${rec.materialCode || rec.materialName}`,
      data: [
        s.moistureBarrier || 50,
        s.oxygenBarrier || 50,
        s.uvShield || 50,
        s.greaseResistance || 50,
        s.sustainability || 50,
        s.costEfficiency || 50
      ],
      backgroundColor: color.bg,
      borderColor: color.border,
      borderWidth: 2,
      pointBackgroundColor: color.border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color.border,
      pointRadius: 4,
    };
  });

  const data = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#e2e8f0',
        },
        grid: {
          color: '#e2e8f0',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          font: { size: 10 },
          backdropColor: 'transparent',
          color: '#64748b'
        },
        pointLabels: {
          font: {
            size: 11,
            weight: '600',
            family: "'Plus Jakarta Sans', sans-serif"
          },
          color: '#334155'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 14,
          padding: 16,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw}%`
        }
      }
    }
  };

  return (
    <div className="w-full h-80 relative">
      <Radar data={data} options={options} />
    </div>
  );
}
