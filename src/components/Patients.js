import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Patients({ profile }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from('patient').select('*');
      if (!error) setPatients(data || []);
      setLoading(false);
    };
    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (patients.length === 0) return <p>No patient data found.</p>;

  const columns = Object.keys(patients[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              {columns.map((col) => <TableCell key={col}>{p[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
