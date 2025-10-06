import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile = location.state?.profile;

  if (!profile) {
    // If no profile data, redirect to login
    navigate('/');
    return null;
  }

  return (
    <div>
      <h1>Welcome, {profile.user_act}</h1>

      {(profile.role === 'Owner' || profile.role === 'Supervisor') && (
        <button onClick={() => navigate('/signup')}>Add New User</button>
      )}

      <h2>Patients</h2>
      <button onClick={() => navigate('/patients')}>View All Patients</button>

      <h2>Staff</h2>
      <button onClick={() => navigate('/staff')}>View All Staff</button>

      <h2>Appointments</h2>
      <button onClick={() => navigate('/appointments')}>View All Appointments</button>

      <h2>Finance</h2>
      <button onClick={() => navigate('/finance')}>View Finance Summary</button>
    </div>
  );
}
