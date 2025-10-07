import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function PatientsPage({ profile }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>All Patients</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
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
  );
}
