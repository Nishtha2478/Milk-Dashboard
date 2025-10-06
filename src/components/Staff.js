import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Staff({ profile }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const fetchStaff = async () => {
      let query = supabase.from('staff').select('*');

      if (profile.role !== 'Owner') {
        if (profile.role === 'Supervisor' || profile.role === 'Department Head') {
          query = query.eq('department', profile.department);
        } else {
          query = query.eq('staff_id', profile.id);
        }
      }

      const { data, error } = await query;
      if (!error) setStaff(data || []);
      setLoading(false);
    };

    fetchStaff();
  }, [profile]);

  if (loading) return <p>Loading staff...</p>;
  if (staff.length === 0) return <p>No staff data found.</p>;

  const columns = Object.keys(staff[0]);

  return (
    <Paper style={{ padding: 20, marginTop: 20, overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => <TableCell key={col}>{col}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((p) => (
            <TableRow key={p.id}>
              {columns.map((col) => <TableCell key={col}>{p[col]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
