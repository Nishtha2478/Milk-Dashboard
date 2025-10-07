// ChartHelper.js
import React from 'react';
import Plot from 'react-plotly.js';

export default function ChartHelper({ dataArray, title, yAxisTitle = 'Value' }) {
  return (
    <Plot
      data={dataArray.map((d, idx) => ({
        x: d.x,
        y: d.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: d.name,
      }))}
      layout={{
        title: title,
        yaxis: { title: yAxisTitle },
        autosize: true,
      }}
      style={{ width: '100%', height: '400px' }}
    />
  );
}

// Named export
export function calculateForecastData(sourceData, monthsToForecast) {
  if (!sourceData.length) return [];

  const labels = sourceData.map(d => `${d.month}/${d.year}`);
  const values = sourceData.map(d => d.profit);

  const last3 = values.slice(-3);
  const growth = last3.length >= 2 ? (last3[last3.length - 1] - last3[0]) / (last3.length - 1) : 0;

  const forecastLabels = [];
  const forecastValues = [];
  let lastValue = values[values.length - 1];

  for (let i = 1; i <= monthsToForecast; i++) {
    const lastDate = new Date(
      sourceData[sourceData.length - 1].year,
      sourceData[sourceData.length - 1].month - 1,
      sourceData[sourceData.length - 1].day || 1
    );
    lastDate.setMonth(lastDate.getMonth() + i);
    forecastLabels.push(`${lastDate.getMonth() + 1}/${lastDate.getFullYear()}`);
    lastValue += growth;
    forecastValues.push(parseFloat(lastValue.toFixed(2)));
  }

  return [
    { x: labels, y: values, name: 'Actual Profit' },
    { x: forecastLabels, y: forecastValues, name: 'Predicted Profit' },
  ];
}
