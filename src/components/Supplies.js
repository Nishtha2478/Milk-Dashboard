import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Supplies({ profile }) {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplies = async () => {
      const { data, error } = await supabase.from('supplies').select('*');
      if (!error) setSupplies(data || []);
      setLoading(false);
    };
    fetchSupplies();
  }, []);

  if (loading) return <p>Loading supplies...</p>;
  if (supplies.length === 0) return <p>No supply data found.</p>;

  const columns = Object.keys(supplies[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {supplies.map((s) => (
            <TableRow key={s.id}>
              {columns.map((col) => <TableCell key={col}>{s[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
