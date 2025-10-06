import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function PatientAppointments({ profile }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase.from('patient_appointments').select('*');
      if (!error) setAppointments(data || []);
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;
  if (appointments.length === 0) return <p>No appointment data found.</p>;

  const columns = Object.keys(appointments[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a.id}>
              {columns.map((col) => <TableCell key={col}>{a[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
