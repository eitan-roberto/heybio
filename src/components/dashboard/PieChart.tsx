'use client';

import { useEffect, useRef } from 'react';

const PIE_COLORS = ['#4ade80', '#60a5fa', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#fbbf24', '#f87171'];

interface PieSlice {
  name: string;
  y: number;
}

interface PieChartProps {
  data: PieSlice[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const css = getComputedStyle(document.documentElement);
    const BOTTOM = css.getPropertyValue('--color-bottom').trim();
    const LOW = css.getPropertyValue('--color-low').trim();
    const TOP = css.getPropertyValue('--color-top').trim();
    const HIGH = css.getPropertyValue('--color-high').trim();

    let destroyed = false;

    import('highcharts').then((Highcharts) => {
      const H = Highcharts.default ?? Highcharts;
      if (destroyed || !containerRef.current) return;

      chartRef.current = H.chart(containerRef.current, {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          style: { fontFamily: '"DM Sans", system-ui, sans-serif' },
          animation: { duration: 400 },
          spacing: [0, 0, 0, 0],
        },
        title: { text: undefined },
        credits: { enabled: false },
        tooltip: {
          backgroundColor: BOTTOM,
          borderColor: LOW,
          borderWidth: 1,
          borderRadius: 12,
          shadow: false,
          style: { color: TOP, fontSize: '13px' },
          pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)',
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          itemStyle: { color: HIGH, fontWeight: '500', fontSize: '12px' },
          itemHoverStyle: { color: TOP },
          symbolRadius: 4,
          symbolHeight: 10,
          symbolWidth: 10,
          margin: 12,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0,
            innerSize: '55%',
            dataLabels: { enabled: false },
            showInLegend: true,
          },
          series: { animation: { duration: 600 } },
        },
        series: [
          {
            type: 'pie' as const,
            name: title,
            data: data.map((d, i) => ({
              name: d.name,
              y: d.y,
              color: PIE_COLORS[i % PIE_COLORS.length],
            })),
          },
        ],
      });
    });

    return () => {
      destroyed = true;
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
        chartRef.current = null;
      }
    };
  }, [data, title]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-high text-sm">
        No data yet
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height: '220px' }} />;
}
