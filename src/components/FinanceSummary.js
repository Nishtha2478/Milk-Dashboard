import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { supabase } from '../supabaseClient';
import ChartHelper, { calculateForecastData } from './ChartHelper';
import '../index.css';

export default function FinanceSummary({ profile }) {
  const [view, setView] = useState('monthly');
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [forecastMonths, setForecastMonths] = useState(6);
  const [chartData, setChartData] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Fetch finance data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('finance_summary')
        .select('*')
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) {
        console.error('Error fetching finance data:', error);
        return;
      }

      if (data) {
        setMonthlyData(data);

        // Build daily data
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

  // Update chart data whenever view or data changes
  useEffect(() => {
    const sourceData = view === 'monthly' ? monthlyData : dailyData;
    if (!sourceData.length) return;

    const chart = calculateForecastData(sourceData, forecastMonths);
    setChartData(chart);
  }, [view, monthlyData, dailyData, forecastMonths]);

  const chartTitle =
    profile.role === 'Department Head'
      ? `Finance Predictions - ${profile.department} Department`
      : 'Finance Predictions - All Departments';

  const tableData = view === 'monthly' ? monthlyData : dailyData;
  const columns =
    view === 'monthly'
      ? ['Year', 'Month', 'Total Income', 'Total Expenses', 'Profit']
      : ['Year', 'Month', 'Day', 'Total Income', 'Total Expenses', 'Profit'];

  return (
    <Paper className="finance-paper">
      <div className="finance-buttons">
        <button
          onClick={() => setView('daily')}
          disabled={view === 'daily'}
          className="finance-toggle-button"
        >
          Daily
        </button>
        <button
          onClick={() => setView('monthly')}
          disabled={view === 'monthly'}
          className="finance-toggle-button"
        >
          Monthly
        </button>
      </div>

      <h3 className="finance-title">{view.charAt(0).toUpperCase() + view.slice(1)} Finance Summary</h3>

      <div className="finance-table-container">
        <Table>
          <TableHead>
            <TableRow>{columns.map(col => <TableCell key={col}>{col}</TableCell>)}</TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, idx) => {
              const isNew = new Date().getTime() - lastFetchTime < 1000 * 60; // highlight if fetched < 1 min ago
              return (
                <TableRow key={idx} className={isNew ? "highlight-new" : ""}>
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

      <div className="forecast-input">
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

      <div className="finance-chart">
        <h3>{chartTitle}</h3>
        <ChartHelper dataArray={chartData} title={chartTitle} yAxisTitle="Profit" />
      </div>
    </Paper>
  );
}
