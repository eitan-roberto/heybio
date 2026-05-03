'use client';

import { useEffect, useRef } from 'react';

interface DayPoint {
  date: string;
  clicks: number;
  nsfw_entered?: number;
}

interface Props {
  data: DayPoint[];
  isNsfw: boolean;
}

export function LinkDailyChart({ data, isNsfw }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const css = getComputedStyle(document.documentElement);
    const LOW    = css.getPropertyValue('--color-low').trim();
    const BOTTOM = css.getPropertyValue('--color-bottom').trim();
    const HIGH   = css.getPropertyValue('--color-high').trim();
    const TOP    = css.getPropertyValue('--color-top').trim();
    const GREEN  = css.getPropertyValue('--color-green').trim();
    const PINK   = css.getPropertyValue('--color-pink').trim();

    let destroyed = false;

    import('highcharts').then((Highcharts) => {
      const H = Highcharts.default ?? Highcharts;
      if (destroyed || !containerRef.current) return;

      chartRef.current = H.chart(containerRef.current, {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          style: { fontFamily: '"DM Sans", system-ui, sans-serif' },
          animation: { duration: 300 },
          spacing: [8, 0, 0, 0],
        },
        title: { text: undefined },
        credits: { enabled: false },
        legend: {
          enabled: isNsfw,
          align: 'center',
          verticalAlign: 'bottom',
          itemStyle: { color: TOP, fontWeight: '500', fontSize: '12px' },
          itemHoverStyle: { color: LOW },
          symbolRadius: 4,
          symbolHeight: 8,
          symbolWidth: 8,
          margin: 12,
        },
        xAxis: {
          categories: data.map((d) => {
            const [, m, day] = d.date.split('-');
            return `${parseInt(m)}/${parseInt(day)}`;
          }),
          lineColor: LOW,
          tickColor: 'transparent',
          labels: { style: { color: HIGH, fontSize: '10px' } },
          crosshair: { color: LOW },
        },
        yAxis: {
          title: { text: undefined },
          gridLineColor: LOW,
          labels: { style: { color: HIGH, fontSize: '10px' } },
          min: 0,
          allowDecimals: false,
        },
        tooltip: {
          backgroundColor: BOTTOM,
          borderColor: LOW,
          borderWidth: 1,
          borderRadius: 12,
          shadow: false,
          padding: 0,
          style: { color: 'var(--color-top)', fontSize: '12px' },
          shared: true,
          useHTML: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter(this: any): string {
            const pts = this.points ?? [];
            const date = pts[0]?.category ?? this.x ?? '';
            const clickPt = pts.find((p: any) => p.series.name === 'Clicks');
            const enterPt = pts.find((p: any) => p.series.name === 'Entered');
            const clicks = clickPt?.y ?? 0;
            const entered = enterPt?.y ?? 0;
            const pct = clicks > 0 ? Math.round((entered / clicks) * 100) : 0;

            const rows = pts.map((p: any) => {
              const extra = isNsfw && p.series.name === 'Entered' && clicks > 0
                ? ` <span style="opacity:0.5">(${pct}%)</span>` : '';
              return `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${p.color}"></span>
                <span style="color:var(--color-top)">${p.series.name}</span>
                <span style="font-weight:600;margin-left:auto;padding-left:12px;color:var(--color-top)">${p.y}${extra}</span>
              </div>`;
            }).join('');

            return `<div style="padding:8px 12px 6px">
              <div style="color:var(--color-mid);font-size:10px;margin-bottom:6px">${date}</div>
              ${rows}
            </div>`;
          },
        },
        plotOptions: {
          column: {
            borderRadius: 8,
            borderWidth: 0,
            groupPadding: 0.15,
            pointPadding: 0.05,
          },
          series: { animation: { duration: 400 } },
        },
        series: [
          {
            type: 'column' as const,
            name: 'Clicks',
            data: data.map((d) => d.clicks),
            color: PINK,
          },
          ...(isNsfw
            ? [{
                type: 'column' as const,
                name: 'Entered',
                data: data.map((d) => d.nsfw_entered ?? 0),
                color: GREEN,
              }]
            : []),
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
  }, [data, isNsfw]);

  return <div ref={containerRef} style={{ width: '100%', height: '200px' }} />;
}
