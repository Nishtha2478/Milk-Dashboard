import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Button, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function FinanceSummary({ profile }) {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMain, setOpenMain] = useState(false);
  const [openDaily, setOpenDaily] = useState(false);
  const [openMonthly, setOpenMonthly] = useState(false);

  const prevDailyData = useRef([]);
  const prevMonthlyData = useRef([]);

  const fetchFinanceData = useCallback(async () => {
    const allowedRoles = ['Owner', 'Supervisor', 'Department Head'];
    if (!profile || !allowedRoles.includes(profile.role)) {
      setDailyData([]);
      setMonthlyData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: daily, error: dailyError } = await supabase
        .from('finance_summary')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (dailyError) throw dailyError;

      const dailyWithDay = (daily || []).map(row => ({
        ...row,
        day: row.day || Math.floor(Math.random() * 28) + 1
      }));

      prevDailyData.current = dailyData;
      setDailyData(dailyWithDay);

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

  useEffect(() => {
    if (!profile) return;
    fetchFinanceData();
    const interval = setInterval(fetchFinanceData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [profile]);

  const highlightChange = (prev, current) => prev !== current ? { backgroundColor: '#fffae6' } : {};

  if (!profile) return <p>Loading profile...</p>;
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CircularProgress size={20} /> Loading finance data...</div>;
  if (error) return <p style={{ color: 'red' }}>Error loading finance data: {error.message}</p>;
  if (!dailyData.length && !monthlyData.length) return <p>No finance data available.</p>;

  return (
    <div>
      {/* Main Finance Summary Button */}
      <Button
        variant="contained"
        onClick={() => setOpenMain(!openMain)}
        style={{ backgroundColor: '#1976d2', color: 'white', marginBottom: 10, textTransform: 'none', fontWeight: 'bold' }}
      >
        Finance Summary {openMain ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse in={openMain}>

        {/* Daily Section */}
        <div style={{ marginBottom: 10 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDaily(!openDaily)}
            style={{ width: '100%', justifyContent: 'space-between', textTransform: 'none', fontWeight: 'bold' }}
          >
            Daily Finance Summary {openDaily ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Collapse in={openDaily}>
            <Paper style={{ padding: 20, marginTop: 10 }}>
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
                        <TableCell style={highlightChange(prevDailyData.current[idx]?.total_income, row.total_income)}>{row.total_income}</TableCell>
                        <TableCell style={highlightChange(prevDailyData.current[idx]?.total_expenses, row.total_expenses)}>{row.total_expenses}</TableCell>
                        <TableCell style={highlightChange(prevDailyData.current[idx]?.profit, row.profit)}>{row.profit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Collapse>
        </div>

        {/* Monthly Section */}
        <div>
          <Button
            variant="outlined"
            onClick={() => setOpenMonthly(!openMonthly)}
            style={{ width: '100%', justifyContent: 'space-between', textTransform: 'none', fontWeight: 'bold' }}
          >
            Monthly Finance Summary {openMonthly ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <Collapse in={openMonthly}>
            <Paper style={{ padding: 20, marginTop: 10 }}>
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
                        <TableCell style={highlightChange(prevMonthlyData.current[idx]?.total_income, row.total_income)}>{row.total_income}</TableCell>
                        <TableCell style={highlightChange(prevMonthlyData.current[idx]?.total_expenses, row.total_expenses)}>{row.total_expenses}</TableCell>
                        <TableCell style={highlightChange(prevMonthlyData.current[idx]?.profit, row.profit)}>{row.profit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Paper>
          </Collapse>
        </div>

      </Collapse>
    </div>
  );
}
