import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Transactions({ profile }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase.from('transactions').select('*');
      if (!error) setTransactions(data || []);
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (transactions.length === 0) return <p>No transaction data found.</p>;

  const columns = Object.keys(transactions[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              {columns.map((col) => <TableCell key={col}>{t[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
