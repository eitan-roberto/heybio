"use client";

import { useEffect, useRef } from "react";
import type Highcharts from "highcharts";

interface DayStat {
  date: string;
  views: number;
  clicks: number;
}

interface ActivityChartProps {
  data: DayStat[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const css = getComputedStyle(document.documentElement);
    const LOW = css.getPropertyValue("--color-low").trim();
    const BOTTOM = css.getPropertyValue("--color-bottom").trim();
    const HIGH = css.getPropertyValue("--color-high").trim();
    const TOP = css.getPropertyValue("--color-top").trim();
    const GREEN = css.getPropertyValue("--color-green").trim();
    const PINK = css.getPropertyValue("--color-pink").trim();

    let destroyed = false;

    import("highcharts").then((Highcharts) => {
      const H = Highcharts.default ?? Highcharts;
      if (destroyed || !containerRef.current) return;

      chartRef.current = H.chart(containerRef.current, {
        chart: {
          type: "column",
          backgroundColor: "transparent",
          style: { fontFamily: '"DM Sans", system-ui, sans-serif' },
          animation: { duration: 400 },
          spacing: [0, 0, 0, 0],
        },
        title: { text: undefined },
        credits: { enabled: false },
        legend: {
          enabled: true,
          align: "center",
          verticalAlign: "bottom",
          itemStyle: { color: TOP, fontWeight: "500", fontSize: "13px" },
          itemHoverStyle: { color: LOW },
          symbolRadius: 4,
          symbolHeight: 10,
          symbolWidth: 10,
          margin: 20,
        },
        xAxis: {
          categories: data.map((d) => d.date),
          lineColor: LOW,
          tickColor: "transparent",
          labels: {
            style: { color: HIGH, fontSize: "11px" },
            rotation: data.length > 14 ? -45 : 0,
          },
          crosshair: { color: LOW },
        },
        yAxis: {
          title: { text: undefined },
          gridLineColor: LOW,
          labels: { style: { color: HIGH, fontSize: "11px" } },
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
          style: { color: "var(--color-top)", fontSize: "13px" },
          shared: true,
          useHTML: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter(this: any): string {
            const pts: Highcharts.Point[] = this.points ?? [];
            const date = (pts[0] as any)?.category ?? pts[0]?.key ?? this.x ?? "";
            const rows = pts
              .map(
                (p) =>
                  `<div style="display:flex;align-items:center;gap:6px;margin:2px 0">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${p.color}"></span>
                    <span style="color:var(--color-top)">${p.series.name}</span>
                    <span style="font-weight:600;margin-left:auto;padding-left:12px;color:var(--color-top)">${p.y}</span>
                  </div>`,
              )
              .join("");
            return `<div style="padding:10px 12px 8px">
              <div style="color:var(--color-mid);font-size:11px;margin-bottom:6px">${date}</div>
              ${rows}
            </div>`;
          },
        },
        plotOptions: {
          column: {
            borderRadius: 12,
            borderWidth: 0,
            groupPadding: 0.15,
            pointPadding: 0.05,
          },
          series: {
            animation: { duration: 600 },
          },
        },
        series: [
          {
            type: "column" as const,
            name: "Views",
            data: data.map((d) => d.views),
            color: GREEN,
          },
          {
            type: "column" as const,
            name: "Clicks",
            data: data.map((d) => d.clicks),
            color: PINK,
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
  }, [data]);

  return <div ref={containerRef} style={{ width: "100%", height: "280px" }} />;
}
