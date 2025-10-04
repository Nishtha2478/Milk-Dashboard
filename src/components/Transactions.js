import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Transactions({ profile }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const allowedRoles = useMemo(() => ['Owner', 'Supervisor', 'Department Head'], []);


  const fetchTransactionData = useCallback(async () => {
    if (!profile) {
      console.log('No profile provided');
      return;
    }

    const hasAccess = allowedRoles.includes(profile.role);
    if (!hasAccess) {
      console.log('User does not have access');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*');
      console.log(data);  
      if (fetchError) throw fetchError;

      console.log('Fetched transactions:', data);
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err);
    } finally {
      setLoading(false);
      console.log('Finished fetchTransactions');
    }
  }, [profile, allowedRoles]);

  // Trigger fetch when profile changes
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p style={{ color: 'red' }}>Error loading transactions: {error.message}</p>;
  if (!transactions || transactions.length === 0) return <p>No transactions found.</p>;

  return (
    <Paper style={{ padding: 20 }}>
      <h2>Transactions</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.trans_id}</TableCell>
                <TableCell>{t.amt}</TableCell>
                <TableCell>{t.trans_date}</TableCell>
                <TableCell>{t.trans_type}</TableCell>
                <TableCell>{t.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
