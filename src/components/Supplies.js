import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Supplies({ profile }) {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplies = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('supplies').select('*');
      if (error) console.error(error);
      else setSupplies(data);
      setLoading(false);
    };
    fetchSupplies();
  }, []);

  const columns = supplies.length > 0 ? Object.keys(supplies[0]) : [];

  if (loading) return <p>Loading supplies...</p>;
  if (supplies.length === 0) return <p>No supplies found.</p>;

  return (
    <Paper style={{ padding: 20, marginTop: 10, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {supplies.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
