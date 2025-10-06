import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Button } from '@mui/material';


function PatientAppointments({ profile }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const allowedRoles = useMemo(() => ['Owner', 'Supervisor', 'Department Head'], []);
  const [open, setOpen] = useState(false);

const fetchPatientAppointments = useCallback(async () => {
  if (!profile) return;

  const hasAccess = allowedRoles.includes(profile.role);
  if (!hasAccess) {
    console.log('User does not have access');
    setAppointments([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    let data = [];
    if (profile.role === 'Owner' || profile.role === 'Supervisor') {
      const { data: allAppointments, error: fetchError } = await supabase
        .from('patient_appointments')
        .select('*');
      if (fetchError) throw fetchError;
      data = allAppointments;
    } else if (profile.role === 'Department Head') {
      const { data: deptStaff, error: deptStaffError } = await supabase
        .from('staff')
        .select('id')
        .eq('department', profile.department);
      if (deptStaffError) throw deptStaffError;

      const staffIds = deptStaff.map(s => s.id);
      if (staffIds.length > 0) {
        const { data: deptAppointments, error: apptError } = await supabase
          .from('patient_appointments')
          .select('*')
          .in('staff_id', staffIds);
        if (apptError) throw apptError;
        data = deptAppointments;
      }
    } else {
      const { data: staffAppointments, error: apptError } = await supabase
        .from('patient_appointments')
        .select('*')
        .eq('staff_id', profile.id);
      if (apptError) throw apptError;
      data = staffAppointments;
    }

    setAppointments(data);
    console.log('Fetched patient appointments:', data);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    setError(err);
  } finally {
    setLoading(false);
  }
}, [profile, allowedRoles]); 


  // Call fetch once profile is ready
  useEffect(() => {
    fetchPatientAppointments();
  }, [fetchPatientAppointments]);

  if (loading)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CircularProgress size={20} /> Loading appointments...
      </div>
    );
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;
  if (!appointments.length) return <p>No appointments found.</p>;

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Patient Appointments</h2>
                    <Button variant="contained" onClick={() => setOpen(!open)}>
                      {open ? 'Collapse' : 'Expand'}
                    </Button>
                  </div>
    {open && (
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Staff ID</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.patient_id}</TableCell>
                <TableCell>{p.staff_id}</TableCell>
                <TableCell>{p.appt_date}</TableCell>
                <TableCell>{p.reason}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.paid ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
    </Paper>
  );
}

export default PatientAppointments;
