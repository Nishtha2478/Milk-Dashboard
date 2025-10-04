import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

export default function Patients({ profile }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile) {
      console.log('No profile provided');
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        console.log('Fetching patients for profile:', profile);

        let data = [];
        let fetchError = null;

        if (profile.role === 'Owner' || profile.role === 'Supervisor') {
          // Owners/Supervisors see all patients
          ({ data, error: fetchError } = await supabase.from('patient').select('*'));
        } else if (profile.role === 'Department Head') {
          // Department heads see all patients in their department
          const { data: deptStaff, error: deptStaffError } = await supabase
            .from('staff')
            .select('id')
            .eq('department', profile.department);

          if (deptStaffError) throw deptStaffError;

          const staffIds = deptStaff.map(s => s.id);

          if (staffIds.length > 0) {
            const { data: appointments, error: apptError } = await supabase
              .from('patient_appointments')
              .select(`
                patient_1:patient_id (
                  id,
                  first_name,
                  last_name,
                  middle_initial,
                  gender,
                  phone
                )
              `)
              .in('staff_id', staffIds);

            if (apptError) throw apptError;

            const seen = new Set();
            data = [];
            appointments.forEach(appt => {
              const patient = appt.patient_1;
              if (patient && !seen.has(patient.id)) {
                seen.add(patient.id);
                data.push(patient);
              }
            });
          }
        } else {
          // Regular staff: only their patients
          const { data: appointments, error: apptError } = await supabase
            .from('patient_appointments')
            .select(`
              patient_1:patient_id (
                id,
                first_name,
                last_name,
                middle_initial,
                gender,
                phone
              )
            `)
            .eq('staff_id', profile.id);

          if (apptError) throw apptError;

          const seen = new Set();
          data = [];
          appointments.forEach(appt => {
            const patient = appt.patient_1;
            if (patient && !seen.has(patient.id)) {
              seen.add(patient.id);
              data.push(patient);
            }
          });
        }

        console.log('Fetched patients:', data);
        setPatients(data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError(err);
      } finally {
        setLoading(false);
        console.log('Finished fetchPatients');
      }
    };

    fetchPatients();
  }, [profile]);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!patients.length) return <p>No patient data found.</p>;

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
      <h2>Patients</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Middle Initial</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.last_name}</TableCell>
                <TableCell>{p.middle_initial}</TableCell>
                <TableCell>{p.first_name}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
