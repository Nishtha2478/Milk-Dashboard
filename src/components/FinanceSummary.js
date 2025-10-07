import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Typography, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateForecastData } from './ChartHelper';

export default function FinanceSummary() {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('daily');
  const [forecastData, setForecastData] = useState([]);

  // Fetch finance data from Supabase
  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // Fetch patient data for financial analysis
      const { data, error } = await supabase.from('patient').select('*');

      if (error) throw error;
      if (data) {
        // Convert timestamps
        const formattedData = data.map((item) => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString(),
        }));

        // Group daily
        const dailyMap = {};
        formattedData.forEach((row) => {
          if (!dailyMap[row.date]) dailyMap[row.date] = { date: row.date, total: 0 };
          dailyMap[row.date].total += row.amount || 0;
        });

        // Group monthly
        const monthlyMap = {};
        formattedData.forEach((row) => {
          const month = new Date(row.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
          if (!monthlyMap[month]) monthlyMap[month] = { month, total: 0 };
          monthlyMap[month].total += row.amount || 0;
        });

        setDailyData(Object.values(dailyMap));
        setMonthlyData(Object.values(monthlyMap));
        setForecastData(calculateForecastData(Object.values(monthlyMap)));
      }
    } catch (error) {
      console.error('Error fetching finance data:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  if (loading) {
    return (
      <Paper className="finance-paper">
        <Typography variant="h6">Loading finance data...</Typography>
        <CircularProgress />
      </Paper>
    );
  }

  const currentData = showType === 'daily' ? dailyData : monthlyData;

  return (
    <div className="finance-summary-wrapper">
      <Paper className="finance-paper">
        <div className="finance-buttons">
          <Button
            variant={showType === 'daily' ? 'contained' : 'outlined'}
            className="finance-toggle-button"
            onClick={() => setShowType('daily')}
          >
            Daily
          </Button>
          <Button
            variant={showType === 'monthly' ? 'contained' : 'outlined'}
            className="finance-toggle-button"
            onClick={() => setShowType('monthly')}
          >
            Monthly
          </Button>
        </div>

        <Typography variant="h6" className="finance-title">
          {showType === 'daily' ? 'Daily Finance Summary' : 'Monthly Finance Summary'}
        </Typography>

        <div className="finance-table-container">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>{showType === 'daily' ? 'Date' : 'Month'}</strong></TableCell>
                <TableCell align="right"><strong>Total Amount ($)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index} className={index === currentData.length - 1 ? 'highlight-new' : ''}>
                  <TableCell>{showType === 'daily' ? row.date : row.month}</TableCell>
                  <TableCell align="right">{row.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Forecasted Profit Trend
        </Typography>

        <div className="finance-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
              <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    </div>
  );
}
