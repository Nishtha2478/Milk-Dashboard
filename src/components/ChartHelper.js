import React from 'react';
import Plot from 'react-plotly.js';

/**
 * Renders a Plotly chart with Actual vs Predicted series.
 * @param {Array} dataArray - Array of objects: [{ x: [], y: [], name: string }]
 * @param {string} title - Chart title
 * @param {string} yAxisTitle - Y-axis title
 */
export default function ChartHelper({ dataArray, title, yAxisTitle = 'Value' }) {
  const colors = ['#1f77b4', '#ff7f0e']; // Actual / Predicted

  const mappedData = (dataArray || []).map((d, idx) => ({
    x: d.x || [],
    y: d.y || [],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { size: 8 },
    line: { color: colors[idx % colors.length] },
    name: d.name || `Series ${idx + 1}`,
  }));

  return (
    <Plot
      data={mappedData}
      layout={{
        title,
        xaxis: { title: 'Month' },
        yaxis: { title: yAxisTitle },
        autosize: true,
        legend: { orientation: 'h', x: 0, y: -0.2 },
        margin: { t: 50, b: 50, l: 50, r: 50 },
      }}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
