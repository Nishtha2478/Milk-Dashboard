import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Patients({ profile }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('patient').select('*');
      if (error) console.error(error);
      else setPatients(data);
      setLoading(false);
    };
    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (!patients.length) return <p>No patients found.</p>;

  // Show only first 5 rows for preview
  const displayedPatients = patients.slice(0, 5);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Patients Preview</h2>

      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: 10 }}
        onClick={() => navigate('/patients-full')}
      >
        Open Full Page
      </Button>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {displayedPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.first_name}</td>
                <td>{p.last_name}</td>
                <td>{p.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
