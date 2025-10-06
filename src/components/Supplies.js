import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';

export default function Supplies({ profile }) {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!profile) return;

    const fetchSupplies = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('supplies')  // exact table name
          .select('*');       // no additional filters needed

        if (error) throw error;
        setSupplies(data || []);
        console.log('Fetched supplies:', data);
      } catch (err) {
        console.error('Error fetching supplies:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, [profile]);

  if (loading) return <p>Loading supplies...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!supplies.length) return <p>No supplies found.</p>;

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Supplies</h2>
                <Button variant="contained" onClick={() => setOpen(!open)}>
                  {open ? 'Collapse' : 'Expand'}
                </Button>
              </div>
    {open && (
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supply ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplies.map((s) => (
              <TableRow key={s.supply_id}>
                <TableCell>{s.supply_id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>{s.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
    </Paper>
  );
}
