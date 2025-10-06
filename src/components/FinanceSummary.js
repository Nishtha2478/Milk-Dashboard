import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function FinanceSummary({ profile }) {
  const [view, setView] = useState('monthly'); // default view
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log(`Fetching ${view} finance data...`);

      try {
        let fetchedData;

        if (view === 'monthly') {
          const { data: monthlyData, error } = await supabase
            .from('finance_summary')
            .select('*');
          if (error) throw error;
          fetchedData = monthlyData;
        } else {
          // Replace this with the correct daily query
          const { data: dailyData, error } = await supabase
            .from('transactions')
            .select(
              `trans_date, total_income:amt, total_expenses:amt, profit:amt` // example, adjust as needed
            )
            .eq('trans_type', 'income'); // for example only
          if (error) throw error;
          fetchedData = dailyData;
        }

        if (!fetchedData || fetchedData.length === 0) {
          console.warn(`No ${view} finance data found.`);
          setData([]);
        } else {
          console.log(`${view} finance data fetched:`, fetchedData);
          setData(fetchedData);
        }
      } catch (err) {
        console.error(`Error fetching ${view} finance data:`, err);
        setError(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  if (loading) return <p>Loading {view} finance...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!data || data.length === 0) return <p>No {view} finance data found.</p>;

  const columns = Object.keys(data[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
      {/* Toggle buttons for Daily/Monthly */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setView('daily')} disabled={view === 'daily'}>
          Daily
        </button>
        <button onClick={() => setView('monthly')} disabled={view === 'monthly'} style={{ marginLeft: 10 }}>
          Monthly
        </button>
      </div>

      <h3>{view.charAt(0).toUpperCase() + view.slice(1)} Finance Summary</h3>
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
