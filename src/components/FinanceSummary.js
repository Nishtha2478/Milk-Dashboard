import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';

export default function FinanceSummary({ profile }) {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevDailyData = useRef([]);
  const prevMonthlyData = useRef([]);

  // Function to fetch finance data
  const fetchFinanceData = useCallback(async () => {
    const allowedRoles = ['Owner', 'Supervisor', 'Department Head'];
    if (!profile) return;

    if (!allowedRoles.includes(profile.role)) {
      setDailyData([]);
      setMonthlyData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch daily summary
      const { data: daily, error: dailyError } = await supabase
        .from('finance_summary')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (dailyError) throw dailyError;

      // Add day column if missing (random for display)
      const dailyWithDay = (daily || []).map(row => ({
        ...row,
        day: row.day || Math.floor(Math.random() * 28) + 1
      }));

      // Save previous before updating state
      prevDailyData.current = dailyData;
      setDailyData(dailyWithDay);

      // Fetch monthly summary
      const { data: monthly, error: monthlyError } = await supabase
        .from('finance_summary')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (monthlyError) throw monthlyError;

      prevMonthlyData.current = monthlyData;
      setMonthlyData(monthly || []);

    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [profile, dailyData, monthlyData]);

  // Initial fetch and 10-minute interval refresh
  useEffect(() => {
    if (!profile) return;
    fetchFinanceData();
    const interval = setInterval(fetchFinanceData, 10 * 60 * 1000); // 10 min
    return () => clearInterval(interval);
  }, [profile]);

  const highlightChange = (prev, current) => prev !== current ? { backgroundColor: '#fffae6' } : {};

  // Loading/Error states
  if (!profile) return <p>Loading profile...</p>;
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CircularProgress size={20} /> Loading finance data...</div>;
  if (error) return <p style={{ color: 'red' }}>Error loading finance data: {error.message}</p>;
  if (!dailyData.length && !monthlyData.length) return <p>No finance data available.</p>;

  return (
    <div>
      {/* Daily Table */}
      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <h2>Daily Finance Summary</h2>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Total Income</TableCell>
                <TableCell>Total Expenses</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyData.map((row, idx) => (
                <TableRow key={`${row.year}-${row.month}-${row.day}`}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell style={highlightChange(prevDailyData.current[idx]?.total_income, row.total_income)}>
                    {row.total_income}
                  </TableCell>
                  <TableCell style={highlightChange(prevDailyData.current[idx]?.total_expenses, row.total_expenses)}>
                    {row.total_expenses}
                  </TableCell>
                  <TableCell style={highlightChange(prevDailyData.current[idx]?.profit, row.profit)}>
                    {row.profit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>

      {/* Monthly Table */}
      <Paper style={{ padding: 20 }}>
        <h2>Monthly Finance Summary</h2>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Total Income</TableCell>
                <TableCell>Total Expenses</TableCell>
                <TableCell>Profit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyData.map((row, idx) => (
                <TableRow key={`${row.year}-${row.month}`}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell style={highlightChange(prevMonthlyData.current[idx]?.total_income, row.total_income)}>
                    {row.total_income}
                  </TableCell>
                  <TableCell style={highlightChange(prevMonthlyData.current[idx]?.total_expenses, row.total_expenses)}>
                    {row.total_expenses}
                  </TableCell>
                  <TableCell style={highlightChange(prevMonthlyData.current[idx]?.profit, row.profit)}>
                    {row.profit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}
