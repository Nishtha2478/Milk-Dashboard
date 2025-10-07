// FinanceSummary.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ChartHelper from './ChartHelper';
import { CircularProgress } from '@mui/material';

export default function FinanceSummary({ profile }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        // Replace 'monthly_finance' with your actual table
        const { data, error } = await supabase
          .from('monthly_finance')
          .select('*')
          .order('month', { ascending: true });

        if (error) throw error;
        setMonthlyData(data);
      } catch (err) {
        console.error('Error fetching monthly finance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  if (loading) return <CircularProgress />;

  if (!monthlyData || monthlyData.length === 0)
    return <p>No monthly finance data available.</p>;

  const chartDataArray = [
    {
      x: monthlyData.map(d => d.month),
      y: monthlyData.map(d => d.revenue),
      name: 'Revenue',
    },
    {
      x: monthlyData.map(d => d.month),
      y: monthlyData.map(d => d.expenses),
      name: 'Expenses',
    },
  ];

  return (
    <div>
      <ChartHelper
        dataArray={chartDataArray}
        title="Monthly Finance Overview"
        yAxisTitle="USD"
      />
    </div>
  );
}
