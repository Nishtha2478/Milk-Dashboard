import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function Staff({ profile }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        console.log('Fetching staff for profile', profile);

        let data;
        let fetchError;

        if (profile.role === 'Owner') {
          ({ data, error: fetchError } = await supabase.from('staff').select('*'));
        } else if (profile.role === 'Supervisor' || profile.role === 'Department Head') {
          ({ data, error: fetchError } = await supabase
            .from('staff')
            .select('*')
            .eq('department', profile.department));
        } else {
          ({ data, error: fetchError } = await supabase
            .from('staff')
            .select('*')
            .eq('staff_id', profile.id));
        }

        if (fetchError) throw fetchError;

        console.log('Fetched staff:', data);
        setStaff(data || []);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError(err);
      } finally {
        setLoading(false);
        console.log('Finished fetchStaff');
      }
    };

    fetchStaff();
  }, [profile]);

  if (loading) return <p>Loading staff...</p>;
  if (error) return <p style={{ color: 'red' }}>Error loading staff: {error.message}</p>;
  if (!staff || staff.length === 0) return <p>No staff data found.</p>;

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
      <h2>Staff</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff ID</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Middle Initial</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Employment Status</TableCell>
              <TableCell>Date of Hire</TableCell>
              <TableCell>Work Schedule</TableCell>
              <TableCell>Supervisor</TableCell>
              <TableCell>Degrees</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Training Record</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Bank Account</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Benefits</TableCell>
              <TableCell>Background</TableCell>
              <TableCell>Immunization Records</TableCell>
              <TableCell>Disciplinary Records</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Visa</TableCell>
              <TableCell>User Account</TableCell>
              <TableCell>Access Level</TableCell>
              <TableCell>Audit Logs</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Work Phone</TableCell>
              <TableCell>Home Phone</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Municipalities</TableCell>
              <TableCell>Zip Code</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.staff_id}</TableCell>
                <TableCell>{p.last_name}</TableCell>
                <TableCell>{p.middle_initial}</TableCell>
                <TableCell>{p.first_name}</TableCell>
                <TableCell>{p.role}</TableCell>
                <TableCell>{p.department}</TableCell>
                <TableCell>{p.employment_status}</TableCell>
                <TableCell>{p.doh}</TableCell>
                <TableCell>{p.work_schedule}</TableCell>
                <TableCell>{p.supervisor}</TableCell>
                <TableCell>{p.degrees}</TableCell>
                <TableCell>{p.license}</TableCell>
                <TableCell>{p.specialization}</TableCell>
                <TableCell>{p.training_record}</TableCell>
                <TableCell>{p.salary}</TableCell>
                <TableCell>{p.bank_account}</TableCell>
                <TableCell>{p.tax}</TableCell>
                <TableCell>{p.benefits}</TableCell>
                <TableCell>{p.background}</TableCell>
                <TableCell>{p.immunizationr}</TableCell>
                <TableCell>{p.disciplinaryr}</TableCell>
                <TableCell>{p.contract}</TableCell>
                <TableCell>{p.visa}</TableCell>
                <TableCell>{p.user_act}</TableCell>
                <TableCell>{p.acs_permission}</TableCell>
                <TableCell>{p.audit_logs}</TableCell>
                <TableCell>{p.b_day}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.wphone}</TableCell>
                <TableCell>{p.hphone}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.address}</TableCell>
                <TableCell>{p.municipalities}</TableCell>
                <TableCell>{p.zip_code}</TableCell>
                <TableCell>{p.city}</TableCell>
                <TableCell>{p.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

export default Staff;
