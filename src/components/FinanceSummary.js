import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { supabase } from '../supabaseClient';
import ChartHelper from './ChartHelper'; // ensure file name matches exactly

export default function FinanceSummary({ profile }) {
  const [view, setView] = useState('monthly'); // default to monthly
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [forecastMonths, setForecastMonths] = useState(6);
  const [chartData, setChartData] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('finance_summary').select('*').order('year', { ascending: true }).order('month', { ascending: true });
      if (!error && data) {
        setMonthlyData(data);

        // Generate approximate daily data
        const dailyRows = [];
        data.forEach(row => {
          const daysInMonth = new Date(row.year, row.month, 0).getDate();
          const dailyIncome = row.total_income / daysInMonth;
          const dailyExpenses = row.total_expenses / daysInMonth;
          const dailyProfit = row.profit / daysInMonth;

          for (let d = 1; d <= daysInMonth; d++) {
            dailyRows.push({
              year: row.year,
              month: row.month,
              day: d,
              total_income: parseFloat(dailyIncome.toFixed(2)),
              total_expenses: parseFloat(dailyExpenses.toFixed(2)),
              profit: parseFloat(dailyProfit.toFixed(2)),
            });
          }
        });

        setDailyData(dailyRows);
        setLastFetchTime(Date.now());
      }
    };

    fetchData();
  }, []);

  // Chart computation
  useEffect(() => {
    const sourceData = view === 'monthly' ? monthlyData : dailyData;
    if (sourceData.length === 0) return;

    const labels = sourceData.map(d =>
      view === 'monthly'
        ? `${d.month}/${d.year}`
        : `${d.month}/${d.day}/${d.year}`
    );
    const values = sourceData.map(d => d.profit);

    // Simple linear prediction based on last 3 entries
    const last3 = values.slice(-3);
    const growth = last3.length >= 2 ? (last3[last3.length - 1] - last3[0]) / (last3.length - 1) : 0;

    const forecastLabels = [];
    const forecastValues = [];
    let lastValue = values[values.length - 1];

    for (let i = 1; i <= forecastMonths; i++) {
      const lastDate = new Date(sourceData[sourceData.length - 1].year, sourceData[sourceData.length - 1].month - 1, sourceData[sourceData.length - 1].day || 1);
      lastDate.setMonth(lastDate.getMonth() + i);
      forecastLabels.push(`${lastDate.getMonth() + 1}/${lastDate.getFullYear()}`);
      lastValue += growth;
      forecastValues.push(parseFloat(lastValue.toFixed(2)));
    }

    setChartData([
      { x: labels, y: values, name: 'Actual Profit' },
      { x: forecastLabels, y: forecastValues, name: 'Predicted Profit' },
    ]);
  }, [view, monthlyData, dailyData, forecastMonths]);

  const chartTitle = profile.role === 'Department Head'
    ? `Finance Predictions - ${profile.department} Department`
    : 'Finance Predictions - All Departments';

  const tableData = view === 'monthly' ? monthlyData : dailyData;
  const columns = view === 'monthly'
    ? ['Year', 'Month', 'Total Income', 'Total Expenses', 'Profit']
    : ['Year', 'Month', 'Day', 'Total Income', 'Total Expenses', 'Profit'];

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setView('daily')} disabled={view === 'daily'}>Daily</button>
        <button onClick={() => setView('monthly')} disabled={view === 'monthly'} style={{ marginLeft: 10 }}>Monthly</button>
      </div>

      <h3>{view.charAt(0).toUpperCase() + view.slice(1)} Finance Summary</h3>
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>{columns.map(col => <TableCell key={col}>{col}</TableCell>)}</TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, idx) => {
              const isNew = new Date().getTime() - lastFetchTime < 1000 * 60; // highlight new entries
              return (
                <TableRow key={idx} style={isNew ? { backgroundColor: '#e0ffe0' } : {}}>
                  {view === 'monthly' ? (
                    <>
                      <TableCell>{row.year}</TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.total_income}</TableCell>
                      <TableCell>{row.total_expenses}</TableCell>
                      <TableCell>{row.profit}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.year}</TableCell>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.day}</TableCell>
                      <TableCell>{row.total_income}</TableCell>
                      <TableCell>{row.total_expenses}</TableCell>
                      <TableCell>{row.profit}</TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Months to forecast:{' '}
          <input
            type="number"
            min="1"
            max="24"
            value={forecastMonths}
            onChange={e => setForecastMonths(parseInt(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>{chartTitle}</h3>
        <ChartHelper dataArray={chartData} title={chartTitle} yAxisTitle="Profit" />
      </div>
    </Paper>
  );
}
